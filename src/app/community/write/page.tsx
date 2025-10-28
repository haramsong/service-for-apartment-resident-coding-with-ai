'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'

const categories = [
  { value: 'free', label: '자유게시판' },
  { value: 'info', label: '정보공유' },
  { value: 'question', label: '질문' },
  { value: 'suggestion', label: '건의사항' },
]

export default function CommunityWritePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('free')
  const [isAnonymous, setIsAnonymous] = useState(false)

  const createPost = trpc.posts.create.useMutation({
    onSuccess: () => {
      router.push('/community')
    },
    onError: (error) => {
      alert('게시글 작성에 실패했습니다: ' + error.message)
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.')
      return
    }

    createPost.mutate({
      title: title.trim(),
      content: content.trim(),
      category,
      isAnonymous,
    })
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
          <h1 className="text-xl font-bold text-gray-900">글쓰기</h1>
        </div>

        {/* 작성 폼 */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 카테고리 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리
              </label>
              <div className="flex flex-wrap gap-2">
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

            {/* 제목 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                maxLength={100}
              />
            </div>

            {/* 내용 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                내용
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요"
                rows={10}
                maxLength={2000}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {content.length}/2000
              </div>
            </div>

            {/* 익명 옵션 */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="anonymous" className="text-sm text-gray-700">
                익명으로 작성
              </label>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={createPost.isLoading || !title.trim() || !content.trim()}
                className="flex-1"
              >
                {createPost.isLoading ? '작성 중...' : '작성 완료'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
