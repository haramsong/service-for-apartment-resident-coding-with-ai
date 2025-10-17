'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Bell, 
  MessageSquare, 
  Car, 
  Package, 
  Calendar,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'

export default function HomePage() {
  const quickActions = [
    {
      icon: MessageSquare,
      title: '커뮤니티',
      description: '새 글 3개',
      color: 'bg-blue-50 text-blue-600',
      href: '/community',
      badge: '3'
    },
    {
      icon: Car,
      title: '주차현황',
      description: '가능 12대',
      color: 'bg-green-50 text-green-600',
      href: '/life'
    },
    {
      icon: Package,
      title: '택배',
      description: '도착 2개',
      color: 'bg-orange-50 text-orange-600',
      href: '/life',
      badge: '2'
    },
    {
      icon: Calendar,
      title: '일정',
      description: '오늘 1개',
      color: 'bg-purple-50 text-purple-600',
      href: '/life'
    }
  ]

  const notices = [
    {
      id: 1,
      title: '정기 소독 실시 안내',
      content: '10월 20일(일) 오후 2시부터 아파트 전체 방역 소독을 실시합니다. 해당 시간에는 외출을 자제해 주시기 바랍니다.',
      type: '긴급',
      time: '2시간 전',
      isImportant: true,
      category: 'urgent'
    },
    {
      id: 2,
      title: '주차장 보수공사 완료',
      content: '지하 1층 주차장 보수공사가 완료되어 정상 이용 가능합니다.',
      type: '완료',
      time: '5시간 전',
      isImportant: false,
      category: 'completed'
    },
    {
      id: 3,
      title: '관리비 고지서 발송',
      content: '10월 관리비 고지서가 발송되었습니다. 확인 부탁드립니다.',
      type: '안내',
      time: '1일 전',
      isImportant: false,
      category: 'info'
    }
  ]

  const recentPosts = [
    {
      title: '엘리베이터 고장 신고',
      author: '101동 주민',
      comments: 5,
      time: '30분 전',
      isHot: true
    },
    {
      title: '반려동물 산책 시간 문의',
      author: '205동 주민',
      comments: 8,
      time: '1시간 전',
      isHot: false
    },
    {
      title: '택배함 이용 관련 건의',
      author: '304동 주민',
      comments: 3,
      time: '2시간 전',
      isHot: false
    }
  ]

  const getBadgeStyle = (category: string) => {
    switch (category) {
      case 'urgent':
        return 'bg-red-50 text-red-600 border-red-200'
      case 'completed':
        return 'bg-green-50 text-green-600 border-green-200'
      case 'info':
        return 'bg-blue-50 text-blue-600 border-blue-200'
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 space-y-6 max-w-md mx-auto lg:max-w-4xl lg:px-8">
        {/* 헤더 */}
        <header className="flex items-center justify-between pt-2 lg:pt-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">안녕하세요! 👋</h1>
            <p className="text-sm text-gray-600 mt-1 lg:text-base">101동 1001호 홍길동님</p>
          </div>
          <button 
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors lg:p-3"
            aria-label="알림 확인"
          >
            <Bell className="h-6 w-6 text-gray-600 lg:h-7 lg:w-7" />
            <div 
              className="notification-badge"
              aria-label="읽지 않은 알림 있음"
            ></div>
          </button>
        </header>

        {/* 메인 콘텐츠 영역 */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0 space-y-6">

        {/* 빠른 액션 */}
        <section className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 lg:text-xl">빠른 메뉴</h2>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Card 
                  key={index} 
                  className="p-4 hover:shadow-md transition-all duration-200 cursor-pointer border-0 shadow-sm focus-within:ring-2 focus-within:ring-primary-500"
                  role="button"
                  tabIndex={0}
                  aria-label={`${action.title} - ${action.description}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      // 네비게이션 로직 추가 필요
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`relative p-3 rounded-xl ${action.color}`}>
                      <Icon className="h-5 w-5" />
                      {action.badge && (
                        <div 
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
                          aria-label={`${action.badge}개의 새 항목`}
                        >
                          {action.badge}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{action.title}</h3>
                      <p className="text-xs text-gray-600 mt-0.5">{action.description}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </section>

        {/* 중요 공지사항 */}
        <section className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 lg:text-xl">공지사항</h2>
            <Button variant="ghost" size="sm" className="text-primary-500 hover:text-primary-600 hover:bg-primary-50 lg:hidden">
              전체보기 <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {notices.map((notice) => (
              <Card 
                key={notice.id} 
                className={`p-4 border-0 shadow-sm hover:shadow-md transition-all duration-200 ${
                  notice.isImportant ? 'bg-red-50 border-l-4 border-l-red-500' : 'bg-white'
                }`}
                role={notice.isImportant ? 'alert' : undefined}
                aria-live={notice.isImportant ? 'assertive' : 'polite'}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {notice.isImportant ? (
                      <AlertCircle className="h-5 w-5 text-red-500" aria-label="긴급 공지" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500" aria-label="일반 공지" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        className={`text-xs font-medium border ${getBadgeStyle(notice.category)}`}
                      >
                        {notice.type}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{notice.time}</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 leading-tight">{notice.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{notice.content}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 최근 커뮤니티 글 */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 lg:text-xl">최근 커뮤니티 글</h2>
            <Button variant="ghost" size="sm" className="text-primary-500 hover:text-primary-600 hover:bg-primary-50">
              더보기 <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <Card className="divide-y divide-gray-100 border-0 shadow-sm">
            {recentPosts.map((post, index) => (
              <article 
                key={index} 
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 focus-within:bg-gray-50"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 truncate">{post.title}</h3>
                    {post.isHot && (
                      <Badge 
                        className="bg-red-100 text-red-600 text-xs px-2 py-0.5 border-red-200"
                        aria-label="인기 게시글"
                      >
                        HOT
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{post.author}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{post.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MessageSquare className="h-3 w-3" />
                    <span>{post.comments}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
              </article>
            ))}
          </Card>
        </section>
        </div>

        {/* 하단 여백 (네비게이션 바 공간 확보) */}
        <div className="h-4 lg:h-8"></div>
      </div>
    </div>
  )
}
