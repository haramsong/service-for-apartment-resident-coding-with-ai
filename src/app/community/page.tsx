import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MessageSquare, Heart, Eye } from 'lucide-react'

export default function CommunityPage() {
  const posts = [
    {
      id: 1,
      title: '엘리베이터 고장 신고',
      content: '3호기 엘리베이터가 고장났습니다. 수리 요청 부탁드려요.',
      author: '101동 주민',
      category: '건의사항',
      likes: 12,
      comments: 5,
      views: 45,
      createdAt: '2시간 전'
    },
    {
      id: 2,
      title: '택배함 이용 안내',
      content: '택배함 비밀번호 변경 안내드립니다.',
      author: '관리사무소',
      category: '공지사항',
      likes: 8,
      comments: 2,
      views: 89,
      createdAt: '5시간 전'
    },
    {
      id: 3,
      title: '반려동물 산책 시간 문의',
      content: '반려동물 산책 가능 시간이 언제인지 궁금합니다.',
      author: '205동 주민',
      category: '질문',
      likes: 3,
      comments: 8,
      views: 23,
      createdAt: '1일 전'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 space-y-6 max-w-md mx-auto lg:max-w-4xl lg:px-8">
        {/* 헤더 - 일관된 스타일 */}
        <div className="flex items-center justify-between pt-2 lg:pt-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">커뮤니티</h1>
            <p className="text-sm text-gray-600 mt-1 lg:text-base">이웃과 소통하는 공간</p>
          </div>
          <Button size="sm" className="bg-primary-500 hover:bg-primary-600 lg:size-default">
            글쓰기
          </Button>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-2 overflow-x-auto pb-2 lg:justify-center lg:overflow-visible">
          <Badge variant="default" className="whitespace-nowrap bg-primary-500">전체</Badge>
          <Badge variant="outline" className="whitespace-nowrap">공지사항</Badge>
          <Badge variant="outline" className="whitespace-nowrap">건의사항</Badge>
          <Badge variant="outline" className="whitespace-nowrap">질문</Badge>
          <Badge variant="outline" className="whitespace-nowrap">자유게시판</Badge>
        </div>

        {/* 게시글 목록 */}
        <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
          {posts.map((post) => (
            <Card key={post.id} className="p-4 border-0 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-2">
                <Badge 
                  variant={post.category === '공지사항' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {post.category}
                </Badge>
                <span className="text-xs text-gray-500">{post.createdAt}</span>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 leading-tight">{post.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">{post.content}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{post.author}</span>
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
                    <span>{post.comments}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 하단 여백 */}
        <div className="h-4"></div>
      </div>
    </div>
  )
}
