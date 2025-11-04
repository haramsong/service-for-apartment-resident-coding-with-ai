'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Eye, AlertCircle } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'

const categoryLabels: Record<string, string> = {
  general: '일반',
  maintenance: '시설관리',
  event: '행사',
  safety: '안전',
}

export default function NoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()

  const { data: notice, isLoading } = trpc.notices.getById.useQuery({
    id: resolvedParams.id,
  })

  const formatDate = (date: Date) => {
    const d = new Date(date)
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">공지사항을 불러오는 중...</div>
      </div>
    )
  }

  if (!notice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 mb-4">공지사항을 찾을 수 없습니다</div>
          <Button onClick={() => router.push('/notices')}>
            공지사항으로 돌아가기
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">공지사항</h1>
        </div>

        {/* 공지사항 내용 */}
        <Card className={`p-6 ${notice.isUrgent ? 'border-l-4 border-l-red-500' : ''}`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              {notice.isUrgent && (
                <AlertCircle className="h-5 w-5 text-red-500" />
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

          <h1 className={`text-2xl font-bold mb-4 leading-tight ${
            notice.isUrgent ? 'text-red-600' : 'text-gray-900'
          }`}>
            {notice.title}
          </h1>

          <div className="prose prose-sm max-w-none mb-6">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {notice.content}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <span className="text-sm text-gray-600">
              관리사무소
            </span>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Eye className="h-4 w-4" />
              <span>{notice.views}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
