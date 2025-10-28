import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import { prisma } from '@/lib/prisma'
import { TRPCError } from '@trpc/server'

export const authRouter = router({
  // 회원가입
  signUp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string(),
        apartmentId: z.string(),
        dong: z.string(),
        ho: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // 이메일 중복 확인
      const existing = await prisma.user.findUnique({
        where: { email: input.email },
      })

      if (existing) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: '이미 존재하는 이메일입니다',
        })
      }

      // TODO: 비밀번호 해싱
      const user = await prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
          apartmentId: input.apartmentId,
          dong: input.dong,
          ho: input.ho,
        },
      })

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          apartmentId: user.apartmentId,
          dong: user.dong,
          ho: user.ho,
          role: user.role,
        },
        session: {
          accessToken: 'temp-token',
          refreshToken: 'temp-refresh',
        },
      }
    }),

  // 로그인
  signIn: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
      })

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '존재하지 않는 사용자입니다',
        })
      }

      // TODO: 비밀번호 검증

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          apartmentId: user.apartmentId,
          dong: user.dong,
          ho: user.ho,
          role: user.role,
        },
        session: {
          accessToken: 'temp-token',
          refreshToken: 'temp-refresh',
        },
      }
    }),

  // 프로필 조회
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    // TODO: ctx.user 사용
    return {
      id: 'temp-id',
      email: 'temp@example.com',
      name: '홍길동',
      apartmentId: 'temp-apt',
      dong: '101',
      ho: '1001',
      role: 'resident' as const,
      createdAt: new Date(),
    }
  }),
})
