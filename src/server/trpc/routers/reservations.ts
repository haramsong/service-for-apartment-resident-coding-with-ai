import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import { prisma } from '@/lib/prisma'
import { TRPCError } from '@trpc/server'

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
          date: new Date(input.date),
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

        const isReserved = reservations.some(
          (r) => r.startTime.getTime() === startDateTime.getTime()
        )

        slots.push({
          startTime,
          endTime,
          isAvailable: !isReserved,
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
      // 시간 문자열을 DateTime으로 변환
      const startDateTime = new Date(`1970-01-01T${input.startTime}:00`)
      const endDateTime = new Date(`1970-01-01T${input.endTime}:00`)

      // 중복 예약 확인
      const existing = await prisma.reservation.findFirst({
        where: {
          facilityId: input.facilityId,
          date: new Date(input.date),
          startTime: startDateTime,
        },
      })

      if (existing) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: '이미 예약된 시간입니다',
        })
      }

      const reservation = await prisma.reservation.create({
        data: {
          facilityId: input.facilityId,
          userId: ctx.session.user.id,
          date: new Date(input.date),
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
