# 변수 중복 선언 오류 수정 완료

*작성일: 2025-10-28*

*작성자: Developer Agent*

*이슈 유형: 컴파일 오류 수정*

*우선순위: High*

## 🐛 문제 상황

### 발생한 오류들
1. **변수 중복 선언**: `recentPosts` 변수가 두 번 선언됨
2. **Next.js 15 호환성**: params가 Promise 타입으로 변경됨
3. **tRPC 버전 호환성**: `isLoading`이 `isPending`으로 변경됨
4. **타입 안전성**: null 허용 속성들의 타입 불일치

### 에러 메시지
```
Module parse failed: Identifier 'recentPosts' has already been declared (146:10)
Type error: Type '{ params: { id: string; }; }' does not satisfy the constraint 'PageProps'
Property 'isLoading' does not exist on type 'UseTRPCMutationResult'
```

## 🔍 원인 분석

### 1. 변수 중복 선언
- 28번째 줄: tRPC 쿼리 결과로 `recentPosts` 선언
- 166번째 줄: 더미 데이터로 `recentPosts` 재선언
- 실제 API 연동 후 더미 데이터가 불필요해짐

### 2. Next.js 15 변경사항
- App Router에서 params가 Promise 타입으로 변경
- `use()` 훅을 사용하여 Promise를 resolve해야 함

### 3. tRPC 버전 업데이트
- mutation의 `isLoading` 속성이 `isPending`으로 변경
- 여러 파일에서 일괄 수정 필요

### 4. 타입 시스템 강화
- NextAuth 타입에서 null 허용 속성 처리
- Prisma 스키마와 타입 정의 불일치

## ✅ 해결 방법

### 1. 중복 변수 제거
```typescript
// 제거된 더미 데이터
const recentPosts = [
  // ... 더미 데이터
]
```

### 2. Next.js 15 params 처리
```typescript
// 변경 전
export default function PostDetailPage({ params }: { params: { id: string } }) {

// 변경 후
export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  // params.id → resolvedParams.id로 모든 사용처 변경
```

### 3. tRPC mutation 속성 변경
```typescript
// 변경 전
disabled={signUpMutation.isLoading}
{signUpMutation.isLoading ? '가입 중...' : '회원가입'}

// 변경 후
disabled={signUpMutation.isPending}
{signUpMutation.isPending ? '가입 중...' : '회원가입'}
```

### 4. 타입 정의 수정
```typescript
// NextAuth 타입 확장
interface User {
  apartmentId: string | null  // null 허용
  dong: string | null
  ho: string | null
  role: string
}

// null 체크 추가
{post.category ? (categoryLabels[post.category] || post.category) : '기타'}
```

### 5. tRPC 컨텍스트 수정
```typescript
// App Router용 컨텍스트 타입 변경
import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'

export const createTRPCContext = async (opts: FetchCreateContextFnOptions) => {
  // res 속성 제거
}
```

### 6. 댓글 API 구조 개선
```typescript
// posts 라우터에 댓글 생성 기능 추가
createComment: protectedProcedure
  .input(z.object({
    postId: z.string(),
    content: z.string(),
    isAnonymous: z.boolean().default(false),
  }))
  .mutation(async ({ input, ctx }) => {
    // 댓글 생성 로직
  })
```

## 📊 수정된 파일 목록

### 핵심 파일
- `src/app/page.tsx` - 중복 변수 제거
- `src/app/community/[id]/page.tsx` - params Promise 처리
- `src/server/trpc/trpc.ts` - 컨텍스트 타입 수정
- `src/types/next-auth.d.ts` - null 허용 타입 수정

### 일괄 수정 파일
- `src/app/auth/signup/page.tsx` - isLoading → isPending
- `src/app/community/write/page.tsx` - isLoading → isPending
- `src/app/community/page.tsx` - null 체크 추가
- `src/server/trpc/routers/posts.ts` - 댓글 API 추가
- `src/lib/auth.ts` - NextAuth 설정 수정

## 🔄 예방 방법

### 1. 코드 리뷰 체크리스트
- [ ] 변수명 중복 검사
- [ ] 더미 데이터와 실제 API 연동 확인
- [ ] 타입 안전성 검증
- [ ] null/undefined 처리 확인

### 2. 개발 프로세스 개선
- TypeScript strict 모드 활용
- ESLint 규칙 강화 (no-redeclare)
- 정기적인 의존성 업데이트 및 호환성 테스트

### 3. 문서화 강화
- API 변경사항 문서화
- 타입 정의 가이드라인 수립
- 마이그레이션 가이드 작성

## 📈 성공 지표

### 빌드 성공
```
✓ Compiled successfully in 3.6s
✓ Generating static pages (12/12)
Route (app)                                 Size  First Load JS
┌ ○ /                                    7.71 kB         148 kB
├ ○ /community                           3.62 kB         144 kB
├ ƒ /community/[id]                      4.07 kB         145 kB
```

### 타입 안전성 확보
- TypeScript 컴파일 에러 0건
- 모든 null/undefined 케이스 처리
- End-to-End 타입 안전성 유지

## 💡 교훈

### 1. 점진적 개발의 중요성
- 더미 데이터 제거를 놓치기 쉬움
- API 연동 후 불필요한 코드 정리 필수

### 2. 프레임워크 업데이트 대응
- Next.js 15의 breaking changes 파악
- tRPC 버전별 API 변경사항 추적

### 3. 타입 시스템 활용
- 컴파일 타임에 오류 발견
- null 안전성으로 런타임 오류 방지

---

*모든 변수 중복 선언 오류가 해결되어 성공적으로 빌드가 완료되었습니다.*
