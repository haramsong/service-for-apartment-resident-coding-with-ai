import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // 인증이 필요한 페이지에서 추가 로직 수행 가능
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // 인증 페이지는 로그인하지 않은 사용자만 접근 가능
        if (req.nextUrl.pathname.startsWith("/auth/")) {
          return !token;
        }
        // 다른 모든 페이지는 인증 필요
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|icon-192x192.png|icon-512x512.png|robots.txt|sitemap.xml).*)",
  ],
};
