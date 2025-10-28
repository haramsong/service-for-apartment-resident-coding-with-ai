import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import { prisma } from '@/lib/prisma'
import { TRPCError } from '@trpc/server'

export const noticesRouter = router({
  // 목록 조회
  getList: publicProcedure
    .input(
      z.object({
        apartmentId: z.string(),
        page: z.number().default(1),
        limit: z.number().default(20),
        category: z.string().optional(),
        isUrgent: z.boolean().optional(),
      })
    )
    .query(async ({ input }) => {
      const skip = (input.page - 1) * input.limit

      const where = {
        apartmentId: input.apartmentId,
        ...(input.category && { category: input.category }),
        ...(input.isUrgent !== undefined && { isUrgent: input.isUrgent }),
      }

      const [items, total] = await Promise.all([
        prisma.notice.findMany({
          where,
          skip,
          take: input.limit,
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: { id: true, name: true },
            },
          },
        }),
        prisma.notice.count({ where }),
      ])

      return {
        items,
        total,
        page: input.page,
        limit: input.limit,
        hasMore: skip + items.length < total,
      }
    }),

  // 상세 조회
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const notice = await prisma.notice.findUnique({
        where: { id: input.id },
        include: {
          author: {
            select: { id: true, name: true, role: true },
          },
          apartment: {
            select: { id: true, name: true },
          },
        },
      })

      if (!notice) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '공지사항을 찾을 수 없습니다',
        })
      }

      // 조회수 증가
      await prisma.notice.update({
        where: { id: input.id },
        data: { views: { increment: 1 } },
      })

      return notice
    }),

  // 작성 (관리자 전용)
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().max(200),
        content: z.string(),
        category: z.string(),
        isUrgent: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: 관리자 권한 확인
      const notice = await prisma.notice.create({
        data: {
          ...input,
          apartmentId: 'temp-apt-id', // TODO: ctx에서 가져오기
          authorId: 'temp-user-id', // TODO: ctx.user.id
        },
      })

      return notice
    }),
})
