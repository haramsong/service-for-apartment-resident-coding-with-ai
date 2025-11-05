'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Heart, MessageSquare, Eye, Send } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { getKSTDate } from '@/lib/dayjs'

const categoryLabels: Record<string, string> = {
  free: '자유게시판',
  info: '정보공유',
  question: '질문',
  suggestion: '건의사항',
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { data: session } = useSession()
  const [comment, setComment] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const utils = trpc.useContext()

  const { data: post, isLoading } = trpc.posts.getById.useQuery({
    id: resolvedParams.id,
  })

  const createComment = trpc.posts.createComment.useMutation({
    onSuccess: () => {
      setComment('')
      setIsAnonymous(false)
      utils.posts.getById.invalidate({ id: resolvedParams.id })
    },
    onError: (error) => {
      alert('댓글 작성에 실패했습니다: ' + error.message)
    }
  })

  const likePost = trpc.posts.like.useMutation({
    onSuccess: () => {
      utils.posts.getById.invalidate({ id: resolvedParams.id })
    }
  })

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    createComment.mutate({
      postId: resolvedParams.id,
      content: comment.trim(),
      isAnonymous,
    })
  }

  const formatTimeAgo = (date: Date) => {
    return getKSTDate(date).fromNow()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">게시글을 불러오는 중...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 mb-4">게시글을 찾을 수 없습니다</div>
          <Button onClick={() => router.push('/community')}>
            커뮤니티로 돌아가기
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
          <h1 className="text-xl font-bold text-gray-900">게시글</h1>
        </div>

        {/* 게시글 내용 */}
        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <Badge variant="secondary" className="text-xs">
              {post.category ? (categoryLabels[post.category] || post.category) : '기타'}
            </Badge>
            <span className="text-xs text-gray-500">
              {formatTimeAgo(new Date(post.createdAt))}
            </span>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="prose prose-sm max-w-none mb-6">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <span className="text-sm text-gray-600">
              {post.isAnonymous ? '익명' : post.author.name}
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Eye className="h-4 w-4" />
                <span>{post.views}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => likePost.mutate({ postId: resolvedParams.id })}
                className="flex items-center gap-1 text-sm"
              >
                <Heart className="h-4 w-4" />
                <span>{post.likes}</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* 댓글 섹션 */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5" />
            <h2 className="font-semibold">댓글 {post.comments.length}개</h2>
          </div>

          {/* 댓글 작성 */}
          {session && (
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="댓글을 입력하세요"
                rows={3}
                className="mb-3"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="anonymous-comment"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="anonymous-comment" className="text-sm text-gray-700">
                    익명
                  </label>
                </div>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!comment.trim() || createComment.isPending}
                >
                  <Send className="h-4 w-4 mr-1" />
                  {createComment.isPending ? '작성 중...' : '댓글 작성'}
                </Button>
              </div>
            </form>
          )}

          {/* 댓글 목록 */}
          <div className="space-y-4">
            {post.comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                아직 댓글이 없습니다
              </div>
            ) : (
              post.comments.map((comment) => (
                <div key={comment.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium">
                      {comment.isAnonymous ? '익명' : comment.author.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(new Date(comment.createdAt))}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
