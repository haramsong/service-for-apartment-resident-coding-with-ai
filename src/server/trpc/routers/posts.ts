import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import { prisma } from '@/lib/prisma'
import { TRPCError } from '@trpc/server'

export const postsRouter = router({
  // 목록 조회
  getList: publicProcedure
    .input(
      z.object({
        apartmentId: z.string(),
        page: z.number().default(1),
        limit: z.number().default(20),
        category: z.string().optional(),
        sortBy: z.enum(['latest', 'popular']).default('latest'),
      })
    )
    .query(async ({ input }) => {
      const skip = (input.page - 1) * input.limit

      const where = {
        apartmentId: input.apartmentId,
        ...(input.category && { category: input.category }),
      }

      const orderBy =
        input.sortBy === 'popular'
          ? [{ likes: 'desc' as const }, { createdAt: 'desc' as const }]
          : { createdAt: 'desc' as const }

      const [items, total] = await Promise.all([
        prisma.post.findMany({
          where,
          skip,
          take: input.limit,
          orderBy,
          include: {
            author: {
              select: { id: true, name: true },
            },
            _count: {
              select: { comments: true },
            },
          },
        }),
        prisma.post.count({ where }),
      ])

      return {
        items: items.map((post) => ({
          ...post,
          commentCount: post._count.comments,
        })),
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
      const post = await prisma.post.findUnique({
        where: { id: input.id },
        include: {
          author: {
            select: { id: true, name: true },
          },
          comments: {
            include: {
              author: {
                select: { id: true, name: true },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      })

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '게시글을 찾을 수 없습니다',
        })
      }

      // 조회수 증가
      await prisma.post.update({
        where: { id: input.id },
        data: { views: { increment: 1 } },
      })

      return post
    }),

  // 작성
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        category: z.string(),
        isAnonymous: z.boolean().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const post = await prisma.post.create({
        data: {
          ...input,
          apartmentId: 'temp-apt-id', // TODO: ctx에서 가져오기
          authorId: 'temp-user-id', // TODO: ctx.user.id
        },
      })

      return post
    }),

  // 좋아요
  like: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ input }) => {
      const post = await prisma.post.update({
        where: { id: input.postId },
        data: { likes: { increment: 1 } },
      })

      return {
        likes: post.likes,
        isLiked: true,
      }
    }),
})
