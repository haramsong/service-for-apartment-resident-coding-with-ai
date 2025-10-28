'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Home, MessageSquare, Building, CalendarCheck, User, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: '홈', href: '/', icon: Home },
  { name: '커뮤니티', href: '/community', icon: MessageSquare },
  { name: '생활', href: '/life', icon: Building },
  { name: '예약', href: '/reservation', icon: CalendarCheck },
  { name: 'MY', href: '/my', icon: User },
]

export default function TopNavigation() {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  // 로딩 중이거나 인증되지 않은 경우 렌더링하지 않음
  if (status === 'loading' || !session) {
    return null
  }

  return (
    <nav className="hidden md:block bg-white border-b border-primary-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
              우리동네
            </Link>
          </div>

          {/* 네비게이션 메뉴 */}
          <div className="flex space-x-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'text-primary-600 bg-primary-50 border-b-2 border-primary-500'
                      : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* 우측 액션 */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative hover:bg-primary-50 hover:text-primary-600">
              <Bell className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full border-2 border-white"></div>
            </Button>
            <div className="text-sm text-secondary-600 font-medium">
              {session.user.dong}동 {session.user.ho}호 {session.user.name}님
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
