'use client'

import { Bell, Settings, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UserInfo {
  name: string
  apartment: string
  unit: string
  profileImage?: string
}

interface UserHeaderProps {
  user: UserInfo
  notifications: number
  onNotificationClick?: () => void
  onSettingsClick?: () => void
}

export default function UserHeader({ 
  user, 
  notifications, 
  onNotificationClick, 
  onSettingsClick 
}: UserHeaderProps) {
  return (
    <header className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            {user.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={`${user.name} 프로필`}
                className="w-12 h-12 rounded-full border-2 border-white/30"
              />
            ) : (
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                <User className="h-6 w-6 text-white" />
              </div>
            )}
          </div>
          
          <div>
            <h1 className="text-lg font-semibold">
              {user.apartment} {user.unit}
            </h1>
            <p className="text-sm text-white/80">
              {user.name}님, 안녕하세요! 👋
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="relative text-white hover:bg-white/20 p-2"
            onClick={onNotificationClick}
            aria-label={`알림 ${notifications}개`}
          >
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {notifications > 99 ? '99+' : notifications}
              </span>
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2"
            onClick={onSettingsClick}
            aria-label="설정"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
