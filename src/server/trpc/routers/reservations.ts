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
      const reservations = await prisma.reservation.findMany({
        where: {
          facilityId: input.facilityId,
          date: new Date(input.date),
        },
      })

      // TODO: 운영시간 기반 슬롯 생성 및 예약 여부 체크
      return {
        date: input.date,
        slots: [],
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
      // 중복 예약 확인
      const existing = await prisma.reservation.findFirst({
        where: {
          facilityId: input.facilityId,
          date: new Date(input.date),
          startTime: input.startTime,
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
          startTime: input.startTime,
          endTime: input.endTime,
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
