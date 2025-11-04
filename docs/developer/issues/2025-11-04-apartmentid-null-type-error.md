# apartmentId Null 타입 에러 해결

*작성일: 2025-11-04*

*작성자: Developer Agent*

## 문제 상황

빌드 시 TypeScript 타입 에러 발생:

```
Type error: Type 'string | null' is not assignable to type 'string | undefined'.
Type 'null' is not assignable to type 'string | undefined'.

./src/server/trpc/routers/notices.ts:105:11
apartmentId: ctx.user.apartmentId,
```

## 원인 분석

1. **Prisma 스키마**: User 모델의 `apartmentId`가 `String?` (nullable)로 정의됨
2. **Notice 생성**: Notice 모델의 `apartmentId`는 `String` (required)
3. **타입 불일치**: `string | null`을 `string`에 할당하려고 시도

## 해결 방법

공지사항 작성 전 `apartmentId` null 체크 추가:

```typescript
if (!ctx.user.apartmentId) {
  throw new TRPCError({
    code: 'BAD_REQUEST',
    message: '아파트 정보가 없습니다.',
  })
}

const notice = await prisma.notice.create({
  data: {
    ...input,
    apartmentId: ctx.user.apartmentId, // 이제 타입 안전
    authorId: ctx.user.id,
  },
})
```

## 예방 방법

1. **타입 가드 사용**: nullable 필드는 항상 사용 전 체크
2. **명확한 에러 메시지**: 사용자에게 왜 실패했는지 알림
3. **일관된 패턴**: 다른 라우터에도 동일한 패턴 적용

## 영향 범위

- ✅ 빌드 성공
- ✅ 타입 안전성 확보
- ✅ 사용자 친화적 에러 메시지

## 관련 파일

- `src/server/trpc/routers/notices.ts`
- `prisma/schema.prisma`
