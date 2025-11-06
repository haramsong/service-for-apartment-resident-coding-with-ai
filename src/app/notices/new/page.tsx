'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'

const categories = [
  { value: 'general', label: '일반' },
  { value: 'maintenance', label: '시설관리' },
  { value: 'event', label: '행사' },
  { value: 'safety', label: '안전' },
]

export default function NewNoticePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('general')
  const [isUrgent, setIsUrgent] = useState(false)

  const createMutation = trpc.notices.create.useMutation({
    onSuccess: () => {
      router.push('/notices')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    createMutation.mutate({
      title: title.trim(),
      content: content.trim(),
      category,
      isUrgent,
    })
  }

  const { data: userProfile } = trpc.auth.getProfile.useQuery(undefined, {
    enabled: !!user,
  })

  // 관리자 권한 확인
  if (userProfile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="p-6 max-w-md">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">접근 권한 없음</h2>
            <p className="text-gray-600 mb-4">관리자만 공지사항을 작성할 수 있습니다.</p>
            <Button onClick={() => router.push('/notices')}>
              공지사항 목록으로
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 space-y-6 max-w-md mx-auto lg:max-w-4xl lg:px-8">
        {/* 헤더 */}
        <div className="pt-2 lg:pt-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">공지사항 작성</h1>
            <p className="text-sm text-gray-600 mt-1 lg:text-base">입주민에게 전달할 공지사항을 작성하세요</p>
          </div>
        </div>

        {/* 작성 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Card className="p-4 border-0 shadow-sm">
            {/* 카테고리 선택 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리
              </label>
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <Badge
                    key={cat.value}
                    variant={category === cat.value ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setCategory(cat.value)}
                  >
                    {cat.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 긴급 공지 */}
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700">긴급 공지</span>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                긴급 공지는 목록 상단에 강조 표시됩니다
              </p>
            </div>

            {/* 제목 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목 <span className="text-red-500">*</span>
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="공지사항 제목을 입력하세요 (최대 200자)"
                maxLength={200}
                required
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {title.length}/200
              </p>
            </div>

            {/* 내용 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                내용 <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="공지사항 내용을 입력하세요"
                rows={10}
                required
                className="resize-none"
              />
            </div>
          </Card>

          {/* 버튼 */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
              disabled={createMutation.isPending}
            >
              취소
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!title.trim() || !content.trim() || createMutation.isPending}
            >
              {createMutation.isPending ? '등록 중...' : '등록하기'}
            </Button>
          </div>
        </form>

        {/* 하단 여백 */}
        <div className="h-4"></div>
      </div>
    </div>
  )
}
