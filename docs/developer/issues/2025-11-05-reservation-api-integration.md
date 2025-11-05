# 예약 페이지 API 연동

_작성일: 2025-11-05_

_작성자: Developer Agent_

## 문제 상황

예약 페이지가 더미 데이터로 구성되어 있어 실제 데이터베이스와 연동이 필요했습니다.

## 해결 방법

### 1. 예약 페이지 API 연동

**변경 파일**: `src/app/reservation/page.tsx`

- tRPC 클라이언트를 사용하여 API 연동
- `trpc.reservations.getFacilities.useQuery`: 시설 목록 조회
- `trpc.reservations.getMyList.useQuery`: 내 예약 목록 조회
- 로딩 상태 처리 추가
- 세션 기반 조건부 쿼리 실행

### 2. Reservations 라우터 userId 실제 세션 연동

**변경 파일**: `src/server/trpc/routers/reservations.ts`

- `ctx.session.user.id`를 사용하여 실제 사용자 ID 연동
- 임시 하드코딩된 'temp-user-id' 제거

### 3. 시설 데이터 시드 스크립트 생성

**생성 파일**: `prisma/seed-facilities.ts`

- 헬스장, 독서실, 회의실, 골프연습장 시설 데이터 추가
- 중복 체크 로직 포함
- 운영시간 및 수용 인원 정보 포함

### 4. 타입 안전성 개선

- `any` 타입 사용으로 Prisma 타입 순환 참조 문제 해결
- `formatDate` 함수에 `Date | string` 타입 지원 추가

## 구현 결과

### 주요 기능

1. **시설 목록 표시**
   - 실제 데이터베이스에서 시설 정보 조회
   - 시설별 아이콘, 운영시간, 수용 인원 표시
   - 로딩 상태 처리

2. **내 예약 현황**
   - 로그인한 사용자의 예약 목록 조회
   - 예약 상태 표시 (예약완료/취소됨)
   - 예약 날짜 및 시간 표시

3. **세션 기반 조건부 렌더링**
   - 로그인하지 않은 경우 쿼리 실행 안 함
   - 아파트 ID가 없는 경우 시설 목록 조회 안 함

## 기술적 세부사항

### tRPC 쿼리 옵션

```typescript
const { data, isLoading } = trpc.reservations.getFacilities.useQuery(
  { apartmentId },
  { enabled: !!apartmentId } // 조건부 실행
)
```

### 타입 처리

- Prisma의 복잡한 타입 순환 참조 문제로 인해 `any` 타입 사용
- 향후 Prisma 타입을 명시적으로 정의하여 개선 가능

## 예방 방법

1. **타입 안전성 개선**
   - Prisma 타입을 명시적으로 export하여 사용
   - `Prisma.ReservationGetPayload<{ include: { facility: true } }>` 형태로 타입 정의

2. **에러 처리 강화**
   - API 호출 실패 시 에러 메시지 표시
   - 재시도 로직 추가

3. **로딩 상태 개선**
   - Skeleton UI 추가
   - 더 나은 사용자 경험 제공

## 다음 단계

1. **예약 생성 기능 구현**
   - 시설 선택 시 예약 모달 표시
   - 날짜 및 시간 선택 UI
   - 예약 생성 API 호출

2. **예약 취소 기능 구현**
   - 취소 버튼 클릭 시 확인 모달
   - 예약 상태 업데이트

3. **예약 변경 기능 구현**
   - 기존 예약 정보 수정
   - 시간 변경 가능

## 참고 자료

- [tRPC 공식 문서](https://trpc.io/docs)
- [Prisma 타입 안전성](https://www.prisma.io/docs/concepts/components/prisma-client/advanced-type-safety)
