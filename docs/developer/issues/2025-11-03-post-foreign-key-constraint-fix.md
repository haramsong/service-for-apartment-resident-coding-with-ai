# 게시글 작성 외래키 제약조건 오류 해결

*작성일: 2025-11-03*

*작성자: Developer Agent*

*이슈 유형: 버그 수정*

*우선순위: High*

## 🐛 문제 상황

### 발생한 오류
게시글 작성 시 외래키 제약조건 위반 오류 발생:
```
Foreign key constraint failed on the field: `apartmentId`
Foreign key constraint failed on the field: `authorId`
```

### 문제점
- `apartmentId`와 `authorId`에 임시 값(`temp-apt-id`, `temp-user-id`) 사용
- 실제 데이터베이스에 존재하지 않는 ID로 인한 외래키 제약조건 위반

## 🔍 원인 분석

### posts.ts 라우터 문제
```typescript
// 문제가 있던 코드
const post = await prisma.post.create({
  data: {
    ...input,
    apartmentId: 'temp-apt-id', // 존재하지 않는 ID
    authorId: 'temp-user-id',   // 존재하지 않는 ID
  },
})
```

### 세션 정보 미활용
- `ctx.user`에 실제 사용자 정보가 있음에도 불구하고 사용하지 않음
- `protectedProcedure`로 인증된 사용자 정보 활용 필요

## ✅ 해결 방법

### 1. 게시글 작성 수정
```typescript
.mutation(async ({ input, ctx }) => {
  if (!ctx.user.apartmentId) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: '아파트 정보가 없습니다',
    })
  }

  const post = await prisma.post.create({
    data: {
      ...input,
      apartmentId: ctx.user.apartmentId,
      authorId: ctx.user.id,
    },
  })

  return post
})
```

### 2. 댓글 작성 수정
```typescript
.mutation(async ({ input, ctx }) => {
  const comment = await prisma.comment.create({
    data: {
      ...input,
      authorId: ctx.user.id,
    },
    include: {
      author: {
        select: { id: true, name: true },
      },
    },
  })

  return comment
})
```

## 📊 해결 결과

### 적용된 변경사항
- ✅ 세션에서 실제 사용자 ID 사용
- ✅ 세션에서 실제 아파트 ID 사용
- ✅ 아파트 정보 없을 시 에러 처리 추가

### 테스트 확인
- 로그인한 사용자의 게시글 작성 정상 동작
- 댓글 작성 정상 동작
- 외래키 제약조건 만족

## 🔄 예방 방법

### 1. 임시 데이터 사용 금지
- 개발 중에도 실제 세션 데이터 사용
- TODO 주석 대신 즉시 구현

### 2. 타입 안전성 활용
- `ctx.user`의 타입 정의 확인
- 필수 필드 검증 추가

### 3. 에러 처리 강화
- 외래키 관련 필드는 존재 여부 검증
- 명확한 에러 메시지 제공

## 📚 참고 문서
- [tRPC 라우터 구현](../issues/2025-10-28-trpc-router-implementation.md)
- [인증/인가 시스템](../issues/2025-10-28-auth-system-implementation.md)

---

*세션 정보를 올바르게 활용하여 외래키 제약조건 오류가 해결되었습니다.*
