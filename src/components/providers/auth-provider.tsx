'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'loading') return // 로딩 중이면 대기

    const isAuthPage = pathname.startsWith('/auth/')
    
    if (!session && !isAuthPage) {
      // 로그인하지 않았고 인증 페이지가 아니면 로그인 페이지로
      router.push('/auth/signin')
    } else if (session && isAuthPage) {
      // 로그인했는데 인증 페이지에 있으면 홈으로
      router.push('/')
    }
  }, [session, status, pathname, router])

  // 로딩 중이거나 리다이렉트 중일 때 로딩 화면
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
