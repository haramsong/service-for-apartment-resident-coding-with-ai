import type { Metadata } from 'next'
import './globals.css'
import BottomNavigation from '@/components/layout/BottomNavigation'

export const metadata: Metadata = {
  title: '우리동네 - 아파트 커뮤니티',
  description: '아파트 입주민을 위한 소통 플랫폼',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <div className="min-h-screen bg-gray-50">
          <main className="pb-16 md:pb-0">
            {children}
          </main>
          <BottomNavigation />
        </div>
      </body>
    </html>
  )
}
