'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MessageSquare, Building, MoreHorizontal, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: '홈', href: '/', icon: Home },
  { name: '커뮤니티', href: '/community', icon: MessageSquare },
  { name: '생활', href: '/life', icon: Building },
  { name: '더보기', href: '/more', icon: MoreHorizontal },
]

export default function TopNavigation() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:block bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary-500">
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
                    'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'text-primary-500 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </Button>
            <div className="text-sm text-gray-600">
              101동 1001호 홍길동님
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
