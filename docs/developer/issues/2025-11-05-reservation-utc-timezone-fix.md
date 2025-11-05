# 예약 DB 저장 시 UTC 시간 문제 수정

_작성일: 2025-11-05_

_작성자: Developer Agent_

## 문제 상황

예약 생성 시 날짜와 시간이 DB에 저장될 때 UTC로 변환되면서 9시간 빠르게 저장되는 문제 발생.

### 증상
- 사용자가 2025-11-06 10:00에 예약
- DB에는 2025-11-06 01:00 (UTC)로 저장됨
- 조회 시 날짜가 하루 전으로 표시됨

## 원인 분석

### 기존 코드 문제점

```typescript
const parseKSTDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day) // 로컬 시간대 기준
}

const startDateTime = new Date(reservationDate)
startDateTime.setHours(startHour, startMin, 0, 0) // 로컬 시간대 기준
```

**문제**: `new Date(year, month, day)`는 로컬 시간대(KST)로 Date 객체를 생성합니다. 이 객체가 PostgreSQL에 저장될 때 UTC로 변환되면서 9시간이 빠르게 저장됩니다.

## 해결 방법

### 수정된 코드

```typescript
const parseDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day)) // UTC 기준
}

const startDateTime = new Date(reservationDate)
startDateTime.setUTCHours(startHour, startMin, 0, 0) // UTC 기준
```

**핵심 변경사항**:
1. `Date.UTC()` 사용하여 UTC 기준 날짜 생성
2. `setUTCHours()` 사용하여 UTC 기준 시간 설정

## 영향 범위

### 수정된 파일
- `src/server/trpc/routers/reservations.ts`

### 수정된 함수
- `parseKSTDate` → `parseDate` (UTC 기준으로 변경)
- `create` mutation (시간 설정 로직 변경)
- `getAvailableSlots` query (날짜 파싱 변경)

## 예방 방법

### 1. 날짜/시간 처리 원칙
- **DB 저장**: 항상 UTC 기준으로 저장
- **사용자 표시**: 클라이언트에서 로컬 시간대로 변환
- **API 통신**: ISO 8601 형식 사용

### 2. 권장 패턴

```typescript
// ✅ 올바른 방법: UTC 기준
const date = new Date(Date.UTC(year, month, day))
date.setUTCHours(hour, minute, 0, 0)

// ❌ 잘못된 방법: 로컬 시간대
const date = new Date(year, month, day)
date.setHours(hour, minute, 0, 0)
```

### 3. 테스트 체크리스트
- [ ] 예약 생성 후 DB에 올바른 날짜/시간 저장 확인
- [ ] 예약 조회 시 올바른 날짜/시간 표시 확인
- [ ] 시간대가 다른 환경에서 테스트

## 참고 자료

- [MDN: Date.UTC()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/UTC)
- [PostgreSQL Timezone 처리](https://www.postgresql.org/docs/current/datatype-datetime.html)
