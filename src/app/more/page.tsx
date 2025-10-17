import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Settings, 
  Bell, 
  HelpCircle, 
  FileText, 
  Phone,
  LogOut,
  ChevronRight 
} from 'lucide-react'

export default function MorePage() {
  const menuItems = [
    {
      icon: User,
      title: '내 정보',
      description: '프로필 및 동/호수 관리',
      badge: null,
      color: 'text-blue-600'
    },
    {
      icon: Bell,
      title: '알림 설정',
      description: '푸시 알림 및 소식 설정',
      badge: null,
      color: 'text-green-600'
    },
    {
      icon: Settings,
      title: '앱 설정',
      description: '테마, 언어 등 앱 환경설정',
      badge: null,
      color: 'text-purple-600'
    }
  ]

  const supportItems = [
    {
      icon: HelpCircle,
      title: '도움말',
      description: '자주 묻는 질문',
      badge: null,
      color: 'text-orange-600'
    },
    {
      icon: FileText,
      title: '이용약관',
      description: '서비스 이용약관 및 개인정보처리방침',
      badge: null,
      color: 'text-gray-600'
    },
    {
      icon: Phone,
      title: '고객센터',
      description: '문의사항 및 신고',
      badge: null,
      color: 'text-red-600'
    }
  ]

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">더보기</h1>
        <p className="text-sm text-gray-600">설정 및 고객지원</p>
      </div>

      {/* 사용자 정보 */}
      <Card className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">홍길동님</h3>
            <p className="text-sm text-gray-600">101동 1001호</p>
          </div>
          <Badge variant="secondary">입주민</Badge>
        </div>
      </Card>

      {/* 계정 설정 */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">계정 설정</h2>
        <Card className="divide-y">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${item.color}`} />
                  <div>
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            )
          })}
        </Card>
      </div>

      {/* 고객지원 */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">고객지원</h2>
        <Card className="divide-y">
          {supportItems.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${item.color}`} />
                  <div>
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            )
          })}
        </Card>
      </div>

      {/* 앱 정보 */}
      <Card className="p-4">
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">우리동네 아파트 커뮤니티</p>
          <p className="text-xs text-gray-500">버전 1.0.0</p>
        </div>
      </Card>

      {/* 로그아웃 */}
      <Card className="p-4">
        <button className="w-full flex items-center justify-center space-x-2 text-red-600 hover:text-red-700">
          <LogOut className="h-5 w-5" />
          <span className="font-medium">로그아웃</span>
        </button>
      </Card>
    </div>
  )
}
