'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Car, 
  Dumbbell, 
  Calendar, 
  CreditCard, 
  Package, 
  Shield,
  ChevronRight 
} from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { useSession } from 'next-auth/react'

export default function LifePage() {
  const { data: session } = useSession()
  
  const { data: notices, isLoading } = trpc.notices.getList.useQuery(
    {
      apartmentId: session?.user?.apartmentId || '',
      limit: 3,
    },
    {
      enabled: !!session?.user?.apartmentId,
    }
  )

  const services = [
    {
      icon: CreditCard,
      title: '관리비 조회',
      description: '이번 달 관리비 확인',
      badge: '신규',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: Car,
      title: '주차 관리',
      description: '주차 현황 및 예약',
      badge: null,
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: Dumbbell,
      title: '시설 예약',
      description: '헬스장, 독서실 예약',
      badge: null,
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: Package,
      title: '택배 조회',
      description: '택배 도착 알림',
      badge: '3개',
      color: 'bg-orange-50 text-orange-600'
    },
    {
      icon: Calendar,
      title: '일정 관리',
      description: '아파트 행사 일정',
      badge: null,
      color: 'bg-pink-50 text-pink-600'
    },
    {
      icon: Shield,
      title: '보안 관리',
      description: '방문자 등록 및 관리',
      badge: null,
      color: 'bg-red-50 text-red-600'
    }
  ]

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\. /g, '.').replace(/\.$/, '')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 space-y-6 max-w-md mx-auto lg:max-w-4xl lg:px-8">
        {/* 헤더 - 일관된 스타일 */}
        <div className="pt-2 lg:pt-6">
          <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">생활</h1>
          <p className="text-sm text-gray-600 mt-1 lg:text-base">아파트 생활에 필요한 모든 서비스</p>
        </div>

        {/* 서비스 그리드 */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Card key={index} className="p-4 border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`relative p-3 rounded-xl ${service.color}`}>
                    <Icon className="h-6 w-6" />
                    {service.badge && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {service.badge === '신규' ? 'N' : service.badge}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{service.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{service.description}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* 최근 공지사항 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">최근 공지사항</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary-500 hover:text-primary-600 hover:bg-primary-50"
              onClick={() => window.location.href = '/notices'}
            >
              더보기 <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          {isLoading ? (
            <Card className="p-8 text-center border-0 shadow-sm">
              <p className="text-sm text-gray-500">공지사항을 불러오는 중...</p>
            </Card>
          ) : notices && notices.items.length > 0 ? (
            <Card className="divide-y divide-gray-100 border-0 shadow-sm">
              {notices.items.map((notice) => (
                <div 
                  key={notice.id} 
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => window.location.href = `/notices/${notice.id}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs border-gray-200">
                        {notice.category}
                      </Badge>
                      <span className="text-xs text-gray-500">{formatDate(notice.createdAt)}</span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900">{notice.title}</h3>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </Card>
          ) : (
            <Card className="p-8 text-center border-0 shadow-sm">
              <p className="text-sm text-gray-500">등록된 공지사항이 없습니다.</p>
            </Card>
          )}
        </div>

        {/* 하단 여백 */}
        <div className="h-4"></div>
      </div>
    </div>
  )
}
