import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // 추가 미들웨어 로직이 필요한 경우 여기에 작성
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    '/my/:path*',
    '/reservation/:path*',
    '/life/complaint/:path*',
    '/api/trpc/auth/getProfile:path*',
    '/api/trpc/auth/updateProfile:path*',
  ],
}
