'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
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
      <div className="w-full max-w-sm mx-auto px-4 py-4 space-y-6 sm:max-w-2xl sm:px-6 md:max-w-4xl md:px-8 lg:max-w-6xl lg:px-12 lg:py-6 xl:max-w-7xl">
        
        {/* 환영 메시지 */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">안녕하세요! 👋</h1>
          <p className="text-sm text-gray-600 mt-1 sm:text-base">101동 1001호 홍길동님</p>
        </div>

        {/* 긴급 알림 배너 - 개선된 버전 */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg mb-6 shadow-lg sm:p-5" role="alert" aria-live="assertive">
          <div className="flex items-center">
            {/* 단일 펄스 애니메이션 적용 */}
            <div className="relative flex-shrink-0 mr-3">
              <div className="absolute inset-0 bg-white rounded-full opacity-25 animate-ping"></div>
              <div className="relative bg-white bg-opacity-20 p-2 rounded-full">
                <AlertCircle className="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-white bg-opacity-20 text-white text-xs font-bold px-2 py-1 rounded-full sm:text-sm">
                  긴급
                </span>
                <span className="text-red-100 text-xs sm:text-sm">지금 확인 필요</span>
              </div>
              <h3 className="font-bold text-white text-sm leading-tight sm:text-base">정기 소독 실시 안내</h3>
              <p className="text-red-100 text-sm mt-1 sm:text-base">오늘 오후 2시부터 방역 소독 진행 - 외출 자제 요청</p>
            </div>
            <button 
              className="ml-3 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 min-w-[44px] min-h-[44px] flex items-center justify-center" 
              aria-label="긴급 알림 닫기"
            >
              <ChevronRight className="h-4 w-4 text-white rotate-90 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className="space-y-3 lg:space-y-4">

          {/* 빠른 액션 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 sm:text-xl">빠른 메뉴</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-4 md:gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Card 
                    key={index} 
                    className="group p-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer border-0 shadow-sm focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 min-h-[88px] touch-manipulation active:scale-[0.98] sm:p-5 sm:min-h-[96px] md:min-h-[104px]"
                    role="button"
                    tabIndex={0}
                    aria-label={`${action.title} - ${action.description}`}
                  >
                    <div className="flex items-center space-x-3 h-full">
                      <div className={`relative p-3 rounded-xl transition-transform duration-200 group-hover:scale-110 ${action.color} sm:p-3.5`}>
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                        {action.badge && (
                          <div 
                            className="absolute -top-2 -right-2 min-w-[24px] h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-white sm:min-w-[28px] sm:h-7 sm:text-sm"
                            aria-label={`${action.badge}개의 새 항목`}
                          >
                            {action.badge}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate group-hover:text-primary-600 transition-colors sm:text-base">{action.title}</h3>
                        <p className="text-xs text-gray-600 mt-1 truncate sm:text-sm">{action.description}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 sm:h-5 sm:w-5" />
                    </div>
                  </Card>
                )
              })}
            </div>
          </section>

          {/* 하단 섹션 - 공지사항과 커뮤니티 글 */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-3 lg:space-y-0">
            {/* 공지사항 */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">공지사항</h2>
                <Button variant="ghost" size="sm" className="text-primary-500 hover:text-primary-600 hover:bg-primary-50 lg:hidden touch-manipulation">
                  전체보기 <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            
              <div className="space-y-3">
                {notices.slice(0, 3).map((notice) => (
                  <Card 
                    key={notice.id} 
                    className={`group p-4 border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer touch-manipulation sm:p-5 ${
                      notice.isImportant 
                        ? 'bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-l-red-500 hover:from-red-100 hover:to-orange-100' 
                        : 'bg-white hover:bg-gray-50'
                    }`}
                    role={notice.isImportant ? 'alert' : 'article'}
                    aria-live={notice.isImportant ? 'assertive' : 'polite'}
                    tabIndex={0}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {notice.isImportant ? (
                          <div className="relative">
                            <AlertCircle className="h-5 w-5 text-red-500 sm:h-6 sm:w-6" aria-label="중요 공지" />
                            {/* 배너에서 이미 애니메이션을 사용하므로 여기서는 정적 표시 */}
                          </div>
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-500 sm:h-6 sm:w-6" aria-label="일반 공지" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge className={`text-xs font-medium border transition-colors sm:text-sm ${getBadgeStyle(notice.category)}`}>
                            {notice.type}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-gray-500 sm:text-sm">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{notice.time}</span>
                          </div>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 leading-tight group-hover:text-primary-600 transition-colors sm:text-lg">{notice.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed sm:text-base">{notice.content}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 sm:h-5 sm:w-5" />
                    </div>
                  </Card>
                ))}
                
                {/* 더보기 버튼 (데스크톱에서만 표시) */}
                <div className="hidden lg:block pt-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-center hover:bg-primary-50 hover:border-primary-300 focus:ring-2 focus:ring-primary-500 touch-manipulation"
                  >
                    공지사항 전체보기 <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </section>

            {/* 최근 커뮤니티 글 */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">최근 커뮤니티 글</h2>
                <Button variant="ghost" size="sm" className="text-primary-500 hover:text-primary-600 hover:bg-primary-50 touch-manipulation">
                  더보기 <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            
              <Card className="divide-y divide-gray-100 border-0 shadow-sm overflow-hidden">
                {recentPosts.map((post, index) => (
                  <article 
                    key={index} 
                    className="group p-4 flex items-center justify-between hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 cursor-pointer focus-within:bg-gray-50 touch-manipulation sm:p-5"
                    tabIndex={0}
                    role="button"
                    aria-label={`${post.title} 게시글 보기`}
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-medium text-gray-900 truncate group-hover:text-primary-600 transition-colors sm:text-lg">{post.title}</h3>
                        {post.isHot && (
                          <Badge 
                            className="bg-gradient-to-r from-orange-100 to-red-100 text-red-600 text-xs px-2 py-0.5 border border-red-200 font-bold sm:text-sm sm:px-3 sm:py-1"
                            aria-label="인기 게시글"
                          >
                            🔥 HOT
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap sm:text-sm">
                        <span className="font-medium">{post.author}</span>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>{post.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors sm:text-sm sm:px-3">
                        <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="font-medium">{post.comments}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-200 sm:h-5 sm:w-5" aria-hidden="true" />
                    </div>
                  </article>
                ))}
                
                {/* 커뮤니티 바로가기 푸터 */}
                <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t sm:p-5">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-center text-primary-600 hover:text-primary-700 hover:bg-primary-50 font-medium focus:ring-2 focus:ring-primary-500 touch-manipulation"
                  >
                    커뮤니티에서 더 많은 이야기 보기 
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </section>
          </div>
        </div>

        {/* 하단 여백 (네비게이션 바 공간 확보) */}
        <div className="h-20 sm:h-24 lg:h-8"></div>
      </div>
    </div>
  )
}
