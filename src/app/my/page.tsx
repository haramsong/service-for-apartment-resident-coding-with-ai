'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Settings, 
  Bell, 
  HelpCircle, 
  Shield, 
  CreditCard,
  FileText,
  LogOut,
  ChevronRight,
  Edit
} from 'lucide-react'

export default function MyPage() {
  const userInfo = {
    name: '홍길동',
    apartment: '101동 1001호',
    phone: '010-1234-5678',
    email: 'hong@example.com',
    joinDate: '2023.03.15',
    profileImage: null
  }

  const menuItems = [
    {
      icon: User,
      title: '프로필 관리',
      description: '개인정보 수정',
      href: '/my/profile',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: Bell,
      title: '알림 설정',
      description: '푸시 알림 관리',
      href: '/my/notifications',
      color: 'bg-green-50 text-green-600',
      badge: '3'
    },
    {
      icon: CreditCard,
      title: '관리비 내역',
      description: '납부 이력 조회',
      href: '/my/payments',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: FileText,
      title: '내 글 관리',
      description: '작성한 글/댓글',
      href: '/my/posts',
      color: 'bg-orange-50 text-orange-600'
    },
    {
      icon: Shield,
      title: '보안 설정',
      description: '비밀번호 변경',
      href: '/my/security',
      color: 'bg-red-50 text-red-600'
    },
    {
      icon: HelpCircle,
      title: '고객센터',
      description: '문의 및 도움말',
      href: '/my/support',
      color: 'bg-gray-50 text-gray-600'
    }
  ]

  const recentActivities = [
    {
      type: '커뮤니티',
      title: '엘리베이터 고장 신고',
      time: '2시간 전',
      status: '답변완료'
    },
    {
      type: '예약',
      title: '피트니스센터 예약',
      time: '1일 전',
      status: '이용완료'
    },
    {
      type: '관리비',
      title: '10월 관리비 납부',
      time: '3일 전',
      status: '납부완료'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="w-full max-w-sm mx-auto px-4 py-6 space-y-6 sm:max-w-2xl sm:px-6 md:max-w-4xl md:px-8 lg:max-w-6xl lg:px-12">
        
        {/* 프로필 카드 */}
        <Card className="p-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white border-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              {userInfo.profileImage ? (
                <img 
                  src={userInfo.profileImage} 
                  alt="프로필 사진" 
                  className="w-16 h-16 rounded-full border-2 border-white/30"
                />
              ) : (
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                  <User className="h-8 w-8 text-white" />
                </div>
              )}
              <button className="absolute -bottom-1 -right-1 bg-white text-primary-600 p-1.5 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                <Edit className="h-3 w-3" />
              </button>
            </div>
            
            <div className="flex-1">
              <h1 className="text-xl font-bold">{userInfo.name}님</h1>
              <p className="text-primary-100 text-sm">{userInfo.apartment}</p>
              <p className="text-primary-200 text-xs mt-1">가입일: {userInfo.joinDate}</p>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20 border border-white/30"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* 최근 활동 */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">최근 활동</h2>
          <Card className="divide-y divide-gray-100">
            {recentActivities.map((activity, index) => (
              <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
                      {activity.type}
                    </Badge>
                    <Badge 
                      className={
                        activity.status === '답변완료' || activity.status === '이용완료' || activity.status === '납부완료'
                          ? 'bg-green-50 text-green-600 border-green-200 text-xs'
                          : 'bg-yellow-50 text-yellow-600 border-yellow-200 text-xs'
                      }
                    >
                      {activity.status}
                    </Badge>
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm">{activity.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </Card>
        </section>

        {/* 메뉴 */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">계정 관리</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              return (
                <Card 
                  key={index} 
                  className="group relative overflow-hidden p-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className={`relative p-3 rounded-xl ${item.color}`}>
                      <Icon className="h-5 w-5" />
                      {item.badge && (
                        <div className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                          {item.badge}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">{item.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </section>

        {/* 로그아웃 */}
        <Card className="p-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            로그아웃
          </Button>
        </Card>
      </div>
    </div>
  )
}
