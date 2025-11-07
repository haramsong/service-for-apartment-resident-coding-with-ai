# formatDate 함수 타입 에러 수정

_작성일: 2025-11-07_

_작성자: Developer Agent_

## 문제 상황

빌드 시 다음과 같은 타입 에러 발생:

```
./src/app/life/page.tsx:149:75
Type error: Argument of type 'string' is not assignable to parameter of type 'Date'.
```

## 원인 분석

1. **formatDate 함수 정의**: `Date` 타입만 받도록 정의됨
   ```typescript
   const formatDate = (date: Date) => { ... }
   ```

2. **실제 사용**: tRPC API에서 반환된 `notice.createdAt`은 `string` 타입
   ```typescript
   {formatDate(notice.createdAt)}  // notice.createdAt은 string
   ```

3. **타입 불일치**: Prisma에서 반환된 `DateTime` 필드가 JSON 직렬화 과정에서 `string`으로 변환됨

## 해결 방법

`formatDate` 함수의 파라미터 타입을 `Date | string`으로 변경:

```typescript
const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\. /g, '.').replace(/\.$/, '')
}
```

### 변경 이유

- `new Date()` 생성자는 `Date` 객체와 `string` 모두 받을 수 있음
- tRPC를 통해 전달되는 날짜는 항상 `string`으로 직렬화됨
- 타입을 유연하게 하여 두 경우 모두 처리 가능

## 예방 방법

1. **유틸리티 함수 타입 정의 시 주의**
   - API 응답 데이터의 실제 타입 확인
   - 직렬화 과정에서 타입 변환 고려

2. **공통 유틸리티 함수 생성**
   - `lib/utils.ts`에 날짜 포맷 함수 추가
   - 프로젝트 전체에서 재사용

3. **타입 가드 추가 고려**
   ```typescript
   const formatDate = (date: Date | string) => {
     const dateObj = typeof date === 'string' ? new Date(date) : date
     return dateObj.toLocaleDateString(...)
   }
   ```

## 영향 범위

- `src/app/life/page.tsx` 파일만 수정
- 빌드 타입 체크 통과
- 기능 동작에는 영향 없음 (런타임에서는 정상 작동했음)

## 참고사항

- TypeScript의 strict 모드에서 타입 체크가 더 엄격해짐
- Next.js 빌드 시 타입 체크가 필수로 실행됨
- 개발 서버에서는 경고만 표시되지만 프로덕션 빌드에서는 에러로 처리됨
