'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MessageSquare, Building, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: '홈',
    href: '/',
    icon: Home,
  },
  {
    name: '커뮤니티',
    href: '/community',
    icon: MessageSquare,
  },
  {
    name: '생활',
    href: '/life',
    icon: Building,
  },
  {
    name: '더보기',
    href: '/more',
    icon: MoreHorizontal,
  },
]

export default function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden safe-area-pb"
      role="navigation"
      aria-label="메인 네비게이션"
    >
      <div className="grid grid-cols-4 h-16 max-w-md mx-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              aria-label={`${item.name} 페이지로 이동${isActive ? ' (현재 페이지)' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center justify-center space-y-1 text-xs transition-all duration-200 relative min-h-[44px]',
                'hover:bg-gray-50 active:bg-gray-100',
                isActive
                  ? 'text-primary-500 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {/* 활성 상태 표시 바 */}
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary-500 rounded-full" />
              )}
              
              <Icon 
                className={cn(
                  'h-5 w-5 transition-colors duration-200',
                  isActive ? 'text-primary-500' : 'text-gray-400'
                )} 
              />
              <span className={cn(
                'text-xs transition-colors duration-200',
                isActive ? 'text-primary-500 font-medium' : 'text-gray-500'
              )}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
      
      {/* Safe area for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-white" />
    </nav>
  )
}
