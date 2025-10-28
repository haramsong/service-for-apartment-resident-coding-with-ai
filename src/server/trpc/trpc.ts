import { initTRPC, TRPCError } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import { ZodError } from 'zod'

// Context 생성
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  return {
    req: opts.req,
    res: opts.res,
  }
}

// tRPC 인스턴스 초기화
const t = initTRPC.context<typeof createTRPCContext>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

// 기본 프로시저
export const router = t.router
export const publicProcedure = t.procedure

// 인증 미들웨어
const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  // TODO: 실제 인증 로직 구현
  const user = null // 임시
  
  if (!user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  
  return next({
    ctx: {
      ...ctx,
      user,
    },
  })
})

export const protectedProcedure = t.procedure.use(isAuthenticated)
