# MY 페이지 최근 활동 데이터 연동

*작성일: 2025-11-04*

*작성자: Developer Agent*

## 문제 상황

MY 페이지의 "최근 활동" 섹션이 하드코딩된 더미 데이터(작성한 글 3, 댓글 12, 예약 2)를 표시하고 있었습니다. 실제 사용자의 활동 데이터를 실시간으로 보여줄 필요가 있었습니다.

## 해결 방법

### 1. User 라우터 생성
`src/server/trpc/routers/user.ts` 파일을 생성하여 사용자 활동 통계 API를 구현했습니다.

```typescript
getActivityStats: protectedProcedure.query(async ({ ctx }) => {
  const [postsCount, commentsCount, reservationsCount] = await Promise.all([
    prisma.post.count({ where: { authorId: ctx.user.id } }),
    prisma.comment.count({ where: { authorId: ctx.user.id } }),
    prisma.reservation.count({ where: { userId: ctx.user.id } }),
  ])

  return { postsCount, commentsCount, reservationsCount }
})
```

**특징:**
- `Promise.all`로 3개 쿼리를 병렬 실행하여 성능 최적화
- `protectedProcedure`로 인증된 사용자만 접근 가능
- 현재 로그인한 사용자의 데이터만 조회

### 2. Root 라우터에 추가
`src/server/trpc/root.ts`에 user 라우터를 추가했습니다.

### 3. MY 페이지 데이터 연동
`src/app/my/page.tsx`를 수정하여 실제 데이터를 표시하도록 했습니다.

**주요 변경사항:**
- `useSession`으로 사용자 정보 가져오기
- `trpc.user.getActivityStats.useQuery`로 활동 통계 조회
- 로딩 상태 처리 (isLoading 시 '-' 표시)
- 세션 정보로 사용자 이름과 동/호수 표시

## 구현 결과

### API 엔드포인트
- `user.getActivityStats`: 사용자 활동 통계 조회
  - 작성한 글 수
  - 댓글 수
  - 예약 수

### UI 개선
- 실시간 데이터 표시
- 로딩 상태 처리
- 세션 기반 사용자 정보 표시

## 기술적 고려사항

### 성능 최적화
- `Promise.all`로 병렬 쿼리 실행
- `enabled: !!session`으로 세션 있을 때만 쿼리 실행

### 보안
- `protectedProcedure`로 인증 필수
- `ctx.user.id`로 본인 데이터만 조회

### 사용자 경험
- 로딩 중 '-' 표시로 깜빡임 최소화
- 데이터 없을 시 0 표시

## 향후 개선 방안

1. **캐싱 전략**: React Query의 staleTime 설정으로 불필요한 재조회 방지
2. **실시간 업데이트**: 글 작성/댓글 작성 시 자동 갱신
3. **상세 활동 내역**: 클릭 시 해당 활동 목록 페이지로 이동
4. **기간별 통계**: 최근 7일, 30일 등 기간별 활동 통계

## 관련 파일

- `src/server/trpc/routers/user.ts` (신규)
- `src/server/trpc/root.ts` (수정)
- `src/app/my/page.tsx` (수정)
