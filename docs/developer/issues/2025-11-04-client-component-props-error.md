# Client Component Props 타입 에러 수정

_작성일: 2025-11-04_

_작성자: Developer Agent_

## 문제 상황

프로덕션 빌드 시 다음 에러들이 발생:

1. **TypeScript 타입 에러**: `formatDate` 함수에 `string` 타입 전달 시 `Date` 타입 기대
   - `src/app/notices/[id]/page.tsx:83`
   - `src/app/notices/page.tsx:100`

2. **Client Component Props 에러**: Server Component에서 이벤트 핸들러 전달
   - `src/app/life/page.tsx` - `onClick` 핸들러를 Button에 전달

## 원인 분석

### 1. formatDate 타입 불일치
```typescript
// 문제 코드
const formatDate = (date: Date) => {
  const d = new Date(date)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
}

// tRPC에서 반환되는 데이터의 createdAt은 string 타입
{formatDate(notice.createdAt)} // ❌ string을 Date로 전달
```

**원인**: Prisma에서 반환된 `Date` 타입이 JSON 직렬화 과정에서 `string`으로 변환됨

### 2. Server Component에서 이벤트 핸들러 사용
```typescript
// 문제 코드 - life/page.tsx
export default function LifePage() {
  return (
    <Button onClick={() => window.location.href = '/notices'}>
      더보기
    </Button>
  )
}
```

**원인**: Next.js 15에서 기본적으로 모든 컴포넌트는 Server Component이며, 이벤트 핸들러는 Client Component에서만 사용 가능

## 해결 방법

### 1. formatDate 함수 타입 수정
```typescript
// 수정 후
const formatDate = (date: Date | string) => {
  const d = new Date(date)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
}
```

**적용 파일**:
- `src/app/notices/[id]/page.tsx`
- `src/app/notices/page.tsx`

### 2. Client Component로 변경
```typescript
// 수정 후
'use client'

import { Card } from '@/components/ui/card'
// ... 나머지 코드
```

**적용 파일**:
- `src/app/life/page.tsx`

## 예방 방법

### 1. 타입 안전성 강화
```typescript
// 유틸리티 함수로 분리
// lib/utils.ts
export const formatDate = (date: Date | string): string => {
  const d = date instanceof Date ? date : new Date(date)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
}
```

### 2. Client/Server Component 명확히 구분
- **이벤트 핸들러 사용 시**: 반드시 `'use client'` 추가
- **상태 관리 필요 시**: Client Component 사용
- **데이터 페칭만 필요 시**: Server Component 유지

### 3. 빌드 전 타입 체크
```bash
# 개발 중 타입 체크
bun run build

# 또는 타입 체크만
tsc --noEmit
```

## 결과

✅ 프로덕션 빌드 성공
✅ 모든 TypeScript 타입 에러 해결
✅ 모든 페이지 정상 렌더링

## 참고사항

- Next.js 15에서는 기본적으로 Server Component 사용
- tRPC를 통해 전달되는 Date 타입은 자동으로 string으로 직렬화됨
- 이벤트 핸들러나 React Hooks 사용 시 반드시 Client Component로 변경 필요
