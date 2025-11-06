import { initTRPC, TRPCError } from '@trpc/server'
import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { ZodError } from 'zod'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

// Context 생성
export const createTRPCContext = async (opts: FetchCreateContextFnOptions) => {
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )

  const { data: { user: supabaseUser } } = await supabase.auth.getUser()
  
  let user = null
  if (supabaseUser) {
    user = await prisma.user.findUnique({
      where: { id: supabaseUser.id },
      include: { apartment: true }
    })
  }
  
  return {
    req: opts.req,
    supabase,
    user,
  }
}

type Context = Awaited<ReturnType<typeof createTRPCContext>>

// tRPC 인스턴스 초기화
const t = initTRPC.context<Context>().create({
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
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  })
})

// 관리자 권한 미들웨어
const isAdmin = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }
  
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  })
})

export const protectedProcedure = t.procedure.use(isAuthenticated)
export const adminProcedure = t.procedure.use(isAdmin)
