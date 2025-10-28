# tRPC 라우터 구현 완료

*작성일: 2025-10-28*

*작성자: Developer Agent*

*이슈 유형: 기능 구현*

*우선순위: High*

## 📋 작업 내용

API 명세서를 기반으로 tRPC 라우터를 구현했습니다.

## 🔧 구현된 라우터

### 1. 인증 (Auth Router)
- `auth.signUp`: 회원가입
- `auth.signIn`: 로그인
- `auth.getProfile`: 프로필 조회

### 2. 공지사항 (Notices Router)
- `notices.getList`: 목록 조회 (페이지네이션, 필터링)
- `notices.getById`: 상세 조회 (조회수 증가)
- `notices.create`: 작성 (관리자 전용)

### 3. 게시판 (Posts Router)
- `posts.getList`: 목록 조회 (정렬, 필터링)
- `posts.getById`: 상세 조회 (댓글 포함)
- `posts.create`: 작성
- `posts.like`: 좋아요

### 4. 시설 예약 (Reservations Router)
- `reservations.getFacilities`: 시설 목록
- `reservations.getAvailableSlots`: 예약 가능 시간
- `reservations.create`: 예약 생성 (중복 체크)
- `reservations.getMyList`: 내 예약 목록

## 📁 생성된 파일

### 서버 사이드
- `src/server/trpc/trpc.ts`: tRPC 설정 및 미들웨어
- `src/server/trpc/root.ts`: 루트 라우터
- `src/server/trpc/routers/auth.ts`: 인증 라우터
- `src/server/trpc/routers/notices.ts`: 공지사항 라우터
- `src/server/trpc/routers/posts.ts`: 게시판 라우터
- `src/server/trpc/routers/reservations.ts`: 예약 라우터
- `src/app/api/trpc/[trpc]/route.ts`: Next.js API 핸들러

### 클라이언트 사이드
- `src/lib/trpc/client.ts`: tRPC React 클라이언트
- `src/lib/trpc/provider.tsx`: tRPC Provider 컴포넌트

## 🎯 주요 특징

### 1. End-to-End 타입 안전성
- TypeScript로 Input/Output 타입 자동 추론
- Zod 스키마로 런타임 검증

### 2. 미들웨어 시스템
- `publicProcedure`: 인증 불필요
- `protectedProcedure`: 인증 필요 (미들웨어 적용)

### 3. 에러 처리
- TRPCError로 표준화된 에러 응답
- Zod 검증 에러 자동 포맷팅

### 4. Prisma 통합
- 모든 라우터에서 Prisma Client 사용
- 관계형 데이터 자동 로딩 (include)

## ⚠️ TODO 항목

### 1. 인증 시스템 완성
```typescript
// 현재: 임시 구현
const user = null

// 필요: NextAuth.js 또는 Supabase Auth 연동
const session = await getServerSession()
const user = session?.user
```

### 2. 비밀번호 해싱
```typescript
// 필요: bcrypt 또는 argon2 사용
import bcrypt from 'bcrypt'
const hashedPassword = await bcrypt.hash(password, 10)
```

### 3. 관리자 권한 체크
```typescript
// 필요: 관리자 전용 미들웨어
const isAdmin = t.middleware(async ({ ctx, next }) => {
  if (ctx.user?.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }
  return next()
})
```

### 4. 예약 시간 슬롯 로직
```typescript
// 필요: 시설 운영시간 기반 슬롯 생성
const slots = generateTimeSlots(facility.operatingHours, reservations)
```

## 📊 사용 예시

### 클라이언트에서 사용
```typescript
'use client'

import { trpc } from '@/lib/trpc/client'

export default function NoticesPage() {
  const { data, isLoading } = trpc.notices.getList.useQuery({
    apartmentId: 'apt-123',
    page: 1,
    limit: 20,
  })

  if (isLoading) return <div>로딩 중...</div>

  return (
    <div>
      {data?.items.map((notice) => (
        <div key={notice.id}>{notice.title}</div>
      ))}
    </div>
  )
}
```

### Mutation 사용
```typescript
const createPost = trpc.posts.create.useMutation()

const handleSubmit = async (data) => {
  await createPost.mutateAsync({
    title: data.title,
    content: data.content,
    category: 'free',
    isAnonymous: false,
  })
}
```

## 🔄 예방 방법

### 1. 타입 안전성 유지
- 모든 Input에 Zod 스키마 정의
- Output 타입 명시적 정의

### 2. 에러 처리 표준화
- TRPCError 일관되게 사용
- 적절한 HTTP 상태 코드 매핑

### 3. 성능 최적화
- 페이지네이션 필수 적용
- N+1 쿼리 방지 (Prisma include 활용)

### 4. 보안
- 모든 민감한 작업에 인증 미들웨어 적용
- Input 검증 철저히 수행

## 📈 다음 단계

1. **인증 시스템 완성**: NextAuth.js 또는 Supabase Auth 연동
2. **나머지 라우터 구현**: Comments, Complaints, ManagementFees
3. **테스트 작성**: 각 라우터별 단위 테스트
4. **Rate Limiting**: Upstash Redis 기반 요청 제한

## 📚 참고 문서
- [API 명세서](../api-specification.md)
- [백엔드 아키텍처 설계](../backend-architecture-design.md)
- [Prisma 스키마](../../prisma/schema.prisma)

---

*tRPC 라우터 기본 구조가 완성되어 클라이언트에서 타입 안전하게 API를 호출할 수 있습니다.*
