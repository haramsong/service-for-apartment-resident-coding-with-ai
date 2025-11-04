'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye, AlertCircle } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'

const categories = [
  { value: '', label: '전체' },
  { value: 'general', label: '일반' },
  { value: 'maintenance', label: '시설관리' },
  { value: 'event', label: '행사' },
  { value: 'safety', label: '안전' },
]

const categoryLabels: Record<string, string> = {
  general: '일반',
  maintenance: '시설관리',
  event: '행사',
  safety: '안전',
}

export default function NoticesPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [selectedCategory, setSelectedCategory] = useState('')

  const { data: noticesData, isLoading } = trpc.notices.getList.useQuery({
    apartmentId: session?.user?.apartmentId || '',
    category: selectedCategory || undefined,
    page: 1,
    limit: 20,
  }, {
    enabled: !!session?.user?.apartmentId,
  })

  const formatDate = (date: Date) => {
    const d = new Date(date)
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 space-y-6 max-w-md mx-auto lg:max-w-4xl lg:px-8">
        {/* 헤더 */}
        <div className="pt-2 lg:pt-6">
          <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">공지사항</h1>
          <p className="text-sm text-gray-600 mt-1 lg:text-base">관리사무소의 중요한 소식</p>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-2 overflow-x-auto pb-2 lg:justify-center lg:overflow-visible">
          {categories.map((category) => (
            <Badge
              key={category.value}
              variant={selectedCategory === category.value ? 'default' : 'outline'}
              className="whitespace-nowrap cursor-pointer"
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
            </Badge>
          ))}
        </div>

        {/* 공지사항 목록 */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-gray-500">공지사항을 불러오는 중...</div>
          </div>
        ) : !noticesData?.items.length ? (
          <div className="text-center py-8">
            <div className="text-gray-500">등록된 공지사항이 없습니다</div>
          </div>
        ) : (
          <div className="space-y-3">
            {noticesData.items.map((notice) => (
              <Card 
                key={notice.id} 
                className={`p-4 border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
                  notice.isUrgent ? 'border-l-4 border-l-red-500' : ''
                }`}
                onClick={() => router.push(`/notices/${notice.id}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {notice.isUrgent && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <Badge 
                      variant={notice.isUrgent ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {notice.category ? (categoryLabels[notice.category] || notice.category) : '일반'}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(notice.createdAt)}
                  </span>
                </div>
                
                <h3 className={`font-semibold text-gray-900 mb-2 leading-tight ${
                  notice.isUrgent ? 'text-red-600' : ''
                }`}>
                  {notice.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                  {notice.content}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    관리사무소
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Eye className="h-3 w-3" />
                    <span>{notice.views}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* 하단 여백 */}
        <div className="h-4"></div>
      </div>
    </div>
  )
}
