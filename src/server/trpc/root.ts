import { router } from './trpc'
import { authRouter } from './routers/auth'
import { noticesRouter } from './routers/notices'
import { postsRouter } from './routers/posts'
import { reservationsRouter } from './routers/reservations'

export const appRouter = router({
  auth: authRouter,
  notices: noticesRouter,
  posts: postsRouter,
  reservations: reservationsRouter,
})

export type AppRouter = typeof appRouter
