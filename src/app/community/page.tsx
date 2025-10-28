'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MessageSquare, Heart, Eye, Plus } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'

const categories = [
  { value: '', label: '전체' },
  { value: 'free', label: '자유게시판' },
  { value: 'info', label: '정보공유' },
  { value: 'question', label: '질문' },
  { value: 'suggestion', label: '건의사항' },
]

const categoryLabels: Record<string, string> = {
  free: '자유게시판',
  info: '정보공유',
  question: '질문',
  suggestion: '건의사항',
}

export default function CommunityPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [selectedCategory, setSelectedCategory] = useState('')

  const { data: postsData, isLoading } = trpc.posts.getList.useQuery({
    apartmentId: session?.user?.apartmentId || '',
    category: selectedCategory || undefined,
    sortBy: 'latest',
    page: 1,
    limit: 20,
  }, {
    enabled: !!session?.user?.apartmentId,
  })

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 space-y-6 max-w-md mx-auto lg:max-w-4xl lg:px-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between pt-2 lg:pt-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">커뮤니티</h1>
            <p className="text-sm text-gray-600 mt-1 lg:text-base">이웃과 소통하는 공간</p>
          </div>
          <Button 
            size="sm" 
            className="bg-primary-500 hover:bg-primary-600 lg:size-default"
            onClick={() => router.push('/community/write')}
          >
            <Plus className="h-4 w-4 mr-1" />
            글쓰기
          </Button>
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

        {/* 게시글 목록 */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-gray-500">게시글을 불러오는 중...</div>
          </div>
        ) : !postsData?.items.length ? (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">아직 게시글이 없습니다</div>
            <Button onClick={() => router.push('/community/write')}>
              첫 번째 글 작성하기
            </Button>
          </div>
        ) : (
          <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
            {postsData.items.map((post) => (
              <Card 
                key={post.id} 
                className="p-4 border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => router.push(`/community/${post.id}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge 
                    variant="secondary"
                    className="text-xs"
                  >
                    {post.category ? (categoryLabels[post.category] || post.category) : '기타'}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {formatTimeAgo(new Date(post.createdAt))}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 leading-tight">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                  {post.content}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {post.isAnonymous ? '익명' : post.author.name}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{post.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      <span>{post.commentCount}</span>
                    </div>
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
