'use client'

import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import UserHeader from '@/components/layout/UserHeader'
import { trpc } from '@/lib/trpc/client'
import { 
  MessageSquare, 
  Car, 
  Package, 
  Calendar,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  CalendarCheck,
  CreditCard,
  Bell
} from 'lucide-react'

export default function HomePage() {
  const { data: session, status } = useSession()

  // 최근 커뮤니티 글 가져오기
  const { data: recentPosts } = trpc.posts.getList.useQuery({
    apartmentId: session?.user?.apartmentId || '',
    page: 1,
    limit: 3,
    sortBy: 'latest',
  }, {
    enabled: !!session?.user?.apartmentId,
  })

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">로딩 중...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">로그인이 필요합니다.</div>
      </div>
    )
  }

  // 사용자 정보 (세션에서 가져옴)
  const userInfo = {
    name: session.user.name || '사용자',
    apartment: `${session.user.dong || '?'}동`,
    unit: `${session.user.ho || '?'}호`,
  }

  const notificationCount = 5

  // 시간 포맷 함수
  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    return `${days}일 전`
  }
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
      icon: FileText,
      title: '민원신청',
      description: '간편 신청',
      color: 'bg-red-50 text-red-600',
      href: '/life/complaint'
    },
    {
      icon: Car,
      title: '주차현황',
      description: '가능 12대',
      color: 'bg-green-50 text-green-600',
      href: '/life/parking'
    },
    {
      icon: CalendarCheck,
      title: '시설예약',
      description: '예약 가능',
      color: 'bg-purple-50 text-purple-600',
      href: '/reservation'
    },
    {
      icon: Package,
      title: '택배',
      description: '도착 2개',
      color: 'bg-orange-50 text-orange-600',
      href: '/life/delivery',
      badge: '2'
    },
    {
      icon: CreditCard,
      title: '관리비',
      description: '10월분 확인',
      color: 'bg-indigo-50 text-indigo-600',
      href: '/life/management-fee'
    },
    {
      icon: Calendar,
      title: '일정',
      description: '오늘 1개',
      color: 'bg-pink-50 text-pink-600',
      href: '/life/schedule'
    },
    {
      icon: Bell,
      title: '알림',
      description: '설정 관리',
      color: 'bg-yellow-50 text-yellow-600',
      href: '/notifications'
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
      {/* 개인화 헤더 */}
      <UserHeader 
        user={userInfo}
        notifications={notificationCount}
        onNotificationClick={() => console.log('알림 클릭')}
        onSettingsClick={() => console.log('설정 클릭')}
      />
      
      <div className="w-full max-w-sm mx-auto px-4 py-4 space-y-6 sm:max-w-2xl sm:px-6 md:max-w-4xl md:px-8 lg:max-w-6xl lg:px-12 lg:py-6 xl:max-w-7xl">
        
        {/* 긴급 알림 배너 - 최적화된 버전 */}
        <div 
          className="relative bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-xl border-l-4 border-red-300 overflow-hidden mb-6" 
          role="alert" 
          aria-live="assertive"
          aria-labelledby="emergency-title"
          aria-describedby="emergency-content"
        >
          {/* 배경 패턴 */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10"></div>
          
          <div className="relative p-5 sm:p-6">
            <div className="flex items-start gap-4">
              {/* 아이콘 영역 - 개선된 애니메이션 */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-white rounded-full opacity-20 animate-pulse"></div>
                <div className="relative bg-white/20 backdrop-blur-sm p-3 rounded-full border border-white/30">
                  <AlertCircle className="h-6 w-6 text-white sm:h-7 sm:w-7" aria-hidden="true" />
                </div>
              </div>
              
              {/* 콘텐츠 영역 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span 
                    className="inline-flex items-center gap-1 bg-white/25 backdrop-blur-sm text-white text-sm font-bold px-3 py-1.5 rounded-full border border-white/30 shadow-sm"
                    aria-label="긴급 공지"
                  >
                    🚨 긴급
                  </span>
                  <span className="text-red-100 text-sm font-medium">즉시 확인 필요</span>
                </div>
                
                <h3 
                  id="emergency-title"
                  className="font-bold text-white text-lg leading-tight mb-2 sm:text-xl"
                >
                  정기 소독 실시 안내
                </h3>
                
                <p 
                  id="emergency-content"
                  className="text-red-50 text-base leading-relaxed sm:text-lg"
                >
                  오늘 오후 2시부터 아파트 전체 방역 소독을 실시합니다. 해당 시간에는 외출을 자제해 주시기 바랍니다.
                </p>
                
                {/* 액션 버튼 */}
                <div className="flex gap-3 mt-4">
                  <button 
                    className="inline-flex items-center gap-2 bg-white text-red-600 font-semibold px-4 py-2 rounded-lg hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-500 text-sm sm:text-base"
                    aria-label="긴급 공지 자세히 보기"
                  >
                    자세히 보기
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button 
                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-medium px-4 py-2 rounded-lg hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-500 border border-white/30 text-sm sm:text-base"
                    aria-label="나중에 알림"
                  >
                    나중에
                  </button>
                </div>
              </div>
              
              {/* 닫기 버튼 */}
              <button 
                className="flex-shrink-0 p-2 hover:bg-white/20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-500 min-w-[44px] min-h-[44px] flex items-center justify-center" 
                aria-label="긴급 알림 닫기"
              >
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className="space-y-4 lg:space-y-6">

          {/* 빠른 액션 */}
          <section aria-labelledby="quick-actions-title">
            <h2 id="quick-actions-title" className="text-lg font-semibold text-gray-900 mb-4 sm:text-xl">빠른 메뉴</h2>
            
            {/* 모바일: 2x4 그리드, 태블릿 이상: 4x2 그리드 */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-4 md:gap-4 lg:gap-5">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Card 
                    key={index} 
                    className="group relative overflow-hidden p-3 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border-0 shadow-sm focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 min-h-[92px] touch-manipulation active:scale-[0.98] sm:p-4 sm:min-h-[100px] md:min-h-[108px] lg:p-5 lg:min-h-[112px] bg-gradient-to-br from-white to-gray-50 hover:from-primary-50 hover:to-blue-50"
                    role="button"
                    tabIndex={0}
                    aria-label={`${action.title} - ${action.description}${action.badge ? `, ${action.badge}개의 새 항목` : ''}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        window.location.href = action.href
                      }
                    }}
                    onClick={() => window.location.href = action.href}
                  >
                    {/* 배경 장식 */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-transparent to-gray-100 opacity-50 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" aria-hidden="true"></div>
                    
                    <div className="relative flex items-center space-x-2 h-full sm:flex-col sm:space-x-0 sm:space-y-2 sm:text-center lg:space-y-3">
                      <div className={`relative p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${action.color} shadow-sm sm:p-3 lg:p-3.5 flex-shrink-0`}>
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" aria-hidden="true" />
                        {action.badge && (
                          <div 
                            className="absolute -top-1.5 -right-1.5 min-w-[22px] h-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-white animate-bounce sm:min-w-[24px] sm:h-6 lg:min-w-[26px] lg:h-7 lg:text-sm"
                            aria-label={`${action.badge}개의 새 항목`}
                            role="status"
                          >
                            {action.badge}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 sm:flex-initial">
                        <h3 className="font-semibold text-gray-900 text-sm truncate group-hover:text-primary-600 transition-colors sm:text-base sm:text-center lg:text-lg">{action.title}</h3>
                        <p className="text-xs text-gray-600 mt-0.5 truncate group-hover:text-primary-500 transition-colors sm:text-sm sm:text-center sm:mt-1">{action.description}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 sm:h-5 sm:w-5 flex-shrink-0 sm:hidden" aria-hidden="true" />
                    </div>
                  </Card>
                )
              })}
            </div>
          </section>

          {/* 하단 섹션 - 공지사항과 커뮤니티 글 */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-4 lg:space-y-0">
            {/* 공지사항 */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">공지사항</h2>
                <Button variant="ghost" size="sm" className="text-primary-500 hover:text-primary-600 hover:bg-primary-50 lg:hidden touch-manipulation">
                  전체보기 <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            
              <div className="space-y-3 sm:space-y-4">
                {notices.slice(0, 3).map((notice) => (
                  <Card 
                    key={notice.id} 
                    className={`group relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer touch-manipulation ${
                      notice.isImportant 
                        ? 'bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 border-l-4 border-l-red-500 hover:from-red-100 hover:via-orange-100 hover:to-yellow-100 shadow-red-100' 
                        : 'bg-white hover:bg-gray-50'
                    }`}
                    role={notice.isImportant ? 'alert' : 'article'}
                    aria-live={notice.isImportant ? 'assertive' : 'polite'}
                    tabIndex={0}
                  >
                    {/* 중요 공지 강조 스트라이프 */}
                    {notice.isImportant && (
                      <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-red-500 opacity-80"></div>
                    )}
                    
                    <div className="p-4 sm:p-5">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {notice.isImportant ? (
                            <div className="relative">
                              <div className="bg-red-100 p-2 rounded-full">
                                <AlertCircle className="h-5 w-5 text-red-600 sm:h-6 sm:w-6" aria-label="중요 공지" />
                              </div>
                            </div>
                          ) : (
                            <div className="bg-green-100 p-2 rounded-full">
                              <CheckCircle className="h-5 w-5 text-green-600 sm:h-6 sm:w-6" aria-label="일반 공지" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge 
                              className={`text-xs font-bold border-2 transition-colors sm:text-sm ${getBadgeStyle(notice.category)}`}
                            >
                              {notice.type}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full sm:text-sm">
                              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="font-medium">{notice.time}</span>
                            </div>
                          </div>
                          
                          <h3 className={`font-semibold mb-2 leading-tight group-hover:text-primary-600 transition-colors ${
                            notice.isImportant ? 'text-red-900 text-lg sm:text-xl' : 'text-gray-900 sm:text-lg'
                          }`}>
                            {notice.title}
                          </h3>
                          
                          <p className={`text-sm leading-relaxed line-clamp-2 sm:text-base ${
                            notice.isImportant ? 'text-red-800' : 'text-gray-600'
                          }`}>
                            {notice.content}
                          </p>
                          
                          {/* 중요 공지 액션 버튼 */}
                          {notice.isImportant && (
                            <div className="mt-3 flex gap-2">
                              <button className="inline-flex items-center gap-1 bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm">
                                확인했습니다
                                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                              <button className="inline-flex items-center gap-1 bg-white text-red-600 text-xs font-medium px-3 py-1.5 rounded-full border border-red-300 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm">
                                자세히 보기
                              </button>
                            </div>
                          )}
                        </div>
                        
                        <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 sm:h-5 sm:w-5" />
                      </div>
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary-500 hover:text-primary-600 hover:bg-primary-50 touch-manipulation"
                  onClick={() => window.location.href = '/community'}
                >
                  더보기 <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            
              <Card className="divide-y divide-gray-100 border-0 shadow-sm overflow-hidden">
                {!recentPosts?.items.length ? (
                  <div className="p-8 text-center text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="mb-2">아직 커뮤니티 글이 없습니다</p>
                    <Button 
                      size="sm" 
                      onClick={() => window.location.href = '/community/write'}
                    >
                      첫 번째 글 작성하기
                    </Button>
                  </div>
                ) : (
                  recentPosts.items.map((post) => (
                    <article 
                      key={post.id} 
                      className="group p-4 flex items-center justify-between hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 cursor-pointer focus-within:bg-gray-50 touch-manipulation sm:p-5"
                      tabIndex={0}
                      role="button"
                      aria-label={`${post.title} 게시글 보기`}
                      onClick={() => window.location.href = `/community/${post.id}`}
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-medium text-gray-900 truncate group-hover:text-primary-600 transition-colors sm:text-lg">
                            {post.title}
                          </h3>
                          {post.likes > 10 && (
                            <Badge 
                              className="bg-gradient-to-r from-orange-100 to-red-100 text-red-600 text-xs px-2 py-0.5 border border-red-200 font-bold sm:text-sm sm:px-3 sm:py-1"
                              aria-label="인기 게시글"
                            >
                              🔥 HOT
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap sm:text-sm">
                          <span className="font-medium">
                            {post.isAnonymous ? '익명' : post.author.name}
                          </span>
                          <span className="text-gray-300">•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{formatTimeAgo(new Date(post.createdAt))}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors sm:text-sm sm:px-3">
                          <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="font-medium">{post.commentCount}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-200 sm:h-5 sm:w-5" aria-hidden="true" />
                      </div>
                    </article>
                  ))
                )}
                
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
        <div className="h-20 sm:h-24 lg:h-12"></div>
      </div>
    </div>
  )
}
