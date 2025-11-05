import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import { prisma } from '@/lib/prisma'
import { TRPCError } from '@trpc/server'

// 날짜 문자열을 UTC 기준 Date로 변환
const parseDate = (dateStr: string) => {
  // YYYY-MM-DD 형식을 UTC 기준으로 파싱
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

export const reservationsRouter = router({
  // 시설 목록
  getFacilities: publicProcedure
    .input(z.object({ apartmentId: z.string() }))
    .query(async ({ input }) => {
      const facilities = await prisma.facility.findMany({
        where: { apartmentId: input.apartmentId },
      })

      return { items: facilities }
    }),

  // 예약 가능 시간
  getAvailableSlots: publicProcedure
    .input(
      z.object({
        facilityId: z.string(),
        date: z.string(),
      })
    )
    .query(async ({ input }) => {
      const facility = await prisma.facility.findUnique({
        where: { id: input.facilityId },
      })

      if (!facility) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '시설을 찾을 수 없습니다',
        })
      }

      const reservations = await prisma.reservation.findMany({
        where: {
          facilityId: input.facilityId,
          date: parseDate(input.date),
          status: 'confirmed',
        },
      })

      // 운영시간 파싱 (기본값: 09:00-22:00)
      const operatingHours = facility.operatingHours as { start: string; end: string } | null
      const startHour = operatingHours?.start ? parseInt(operatingHours.start.split(':')[0]) : 9
      const endHour = operatingHours?.end ? parseInt(operatingHours.end.split(':')[0]) : 22

      // 1시간 단위 슬롯 생성
      const slots = []
      for (let hour = startHour; hour < endHour; hour++) {
        const startTime = `${hour.toString().padStart(2, '0')}:00`
        const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`
        const startDateTime = new Date(`1970-01-01T${startTime}:00`)

        // 해당 시간대 예약 수 계산
        const reservationCount = reservations.filter(
          (r) => r.startTime.getTime() === startDateTime.getTime()
        ).length

        // 정원 초과 여부 확인
        const isFull = facility.capacity ? reservationCount >= facility.capacity : reservationCount > 0

        slots.push({
          startTime,
          endTime,
          isAvailable: !isFull,
          currentCount: reservationCount,
          capacity: facility.capacity,
        })
      }

      return {
        date: input.date,
        slots,
      }
    }),

  // 예약 생성
  create: protectedProcedure
    .input(
      z.object({
        facilityId: z.string(),
        date: z.string(),
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // UTC 기준 날짜 생성
      const reservationDate = parseDate(input.date)
      
      // 시간 문자열을 UTC DateTime으로 변환
      const [startHour, startMin] = input.startTime.split(':').map(Number)
      const [endHour, endMin] = input.endTime.split(':').map(Number)
      
      const startDateTime = new Date(reservationDate)
      startDateTime.setUTCHours(startHour, startMin, 0, 0)
      
      const endDateTime = new Date(reservationDate)
      endDateTime.setUTCHours(endHour, endMin, 0, 0)

      // 시설 정보 조회
      const facility = await prisma.facility.findUnique({
        where: { id: input.facilityId },
      })

      if (!facility) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '시설을 찾을 수 없습니다',
        })
      }

      // 해당 시간대 예약 수 확인
      const existingReservations = await prisma.reservation.findMany({
        where: {
          facilityId: input.facilityId,
          date: reservationDate,
          startTime: startDateTime,
          status: 'confirmed',
        },
      })

      // 정원 초과 확인
      if (facility.capacity && existingReservations.length >= facility.capacity) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: '해당 시간대 정원이 초과되었습니다',
        })
      }

      // 본인의 같은 날짜 예약 확인
      const myReservations = await prisma.reservation.findMany({
        where: {
          userId: ctx.session.user.id,
          date: reservationDate,
          status: 'confirmed',
        },
      })

      // 시간 겹침 확인
      for (const existing of myReservations) {
        const existingStart = existing.startTime.getTime()
        const existingEnd = existing.endTime.getTime()
        const newStart = startDateTime.getTime()
        const newEnd = endDateTime.getTime()

        if (newStart < existingEnd && newEnd > existingStart) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: '이미 해당 시간에 다른 예약이 있습니다',
          })
        }
      }

      const reservation = await prisma.reservation.create({
        data: {
          facilityId: input.facilityId,
          userId: ctx.session.user.id,
          date: reservationDate,
          startTime: startDateTime,
          endTime: endDateTime,
        },
        include: {
          facility: {
            select: { id: true, name: true },
          },
        },
      })

      return reservation
    }),

  // 내 예약 목록
  getMyList: protectedProcedure
    .input(
      z.object({
        status: z.enum(['confirmed', 'cancelled']).optional(),
        page: z.number().default(1),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input, ctx }) => {
      const skip = (input.page - 1) * input.limit

      const where = {
        userId: ctx.session.user.id,
        ...(input.status && { status: input.status }),
      }

      const [items, total] = await Promise.all([
        prisma.reservation.findMany({
          where,
          skip,
          take: input.limit,
          orderBy: { date: 'desc' },
          include: {
            facility: true,
          },
        }),
        prisma.reservation.count({ where }),
      ])

      return { items, total }
    }),
})
