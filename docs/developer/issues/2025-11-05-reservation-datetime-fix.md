# 예약 날짜/시간 저장 오류 수정

_작성일: 2025-11-05_

_작성자: Developer Agent_

## 문제 상황

예약 생성 시 날짜와 시간이 UTC 기준으로 변환되어 저장되면서, 한국 시간(KST)과 9시간 차이가 발생했습니다.

### 증상
- 사용자가 선택한 시간: 2025-11-06 14:00
- 실제 저장된 시간: 2025-11-06 05:00 (UTC)
- 조회 시 표시되는 시간: 2025-11-06 14:00 (브라우저가 UTC를 KST로 변환)

### 영향
- 예약 가능 시간 조회 시 이미 예약된 시간이 예약 가능으로 표시됨
- 같은 시간대 중복 예약 가능
- 예약 목록에서 시간이 정확하게 표시되지 않음

## 원인 분석

### 1. UTC 변환 로직
```typescript
// 문제가 있던 코드
const reservationDate = parseDate(input.date) // UTC 기준
startDateTime.setUTCHours(startHour, startMin, 0, 0) // UTC 시간 설정
```

### 2. 시간 비교 불일치
```typescript
// getAvailableSlots에서 1970-01-01 기준 시간 사용
const startDateTime = new Date(`1970-01-01T${startTime}:00`)
// 실제 예약은 2025-11-06 기준 시간 사용
```

## 해결 방법

### 1. 로컬 시간 기준으로 Date 객체 생성
```typescript
// 수정된 코드
const [year, month, day] = input.date.split('-').map(Number)
const [startHour, startMin] = input.startTime.split(':').map(Number)

const reservationDate = new Date(year, month - 1, day)
const startDateTime = new Date(year, month - 1, day, startHour, startMin)
const endDateTime = new Date(year, month - 1, day, endHour, endMin)
```

### 2. 일관된 날짜 기준 사용
```typescript
// getAvailableSlots에서도 동일한 날짜 기준 사용
const [year, month, day] = input.date.split('-').map(Number)
const slotStart = new Date(year, month - 1, day, hour, 0)
```

### 3. parseDate 함수 제거
- UTC 변환이 필요 없으므로 parseDate 함수 제거
- 모든 날짜/시간을 로컬 시간 기준으로 처리

## 수정된 파일

- `src/server/trpc/routers/reservations.ts`
  - `create` mutation: 로컬 시간 기준으로 Date 생성
  - `getAvailableSlots` query: 일관된 날짜 기준 사용
  - `parseDate` 함수 제거

## 테스트 방법

1. 예약 생성
   - 날짜: 2025-11-06
   - 시간: 14:00-15:00
   - 확인: DB에 정확한 시간 저장

2. 예약 가능 시간 조회
   - 같은 날짜 조회
   - 확인: 14:00-15:00 시간대가 예약 불가로 표시

3. 중복 예약 방지
   - 같은 시간대 재예약 시도
   - 확인: "해당 시간대 정원이 초과되었습니다" 에러

## 예방 방법

1. **타임존 일관성 유지**
   - 모든 날짜/시간을 로컬 시간 기준으로 처리
   - UTC 변환은 필요한 경우에만 명시적으로 수행

2. **Date 생성 방식 통일**
   - `new Date(year, month, day, hour, minute)` 형식 사용
   - 문자열 파싱 방식 지양

3. **시간 비교 시 동일한 기준 사용**
   - 날짜와 시간을 함께 포함한 Date 객체로 비교
   - 시간만 따로 비교하지 않기

## 참고사항

- PostgreSQL의 TIMESTAMP 타입은 타임존 정보를 저장하지 않음
- Prisma는 Date 객체를 그대로 저장하므로 로컬 시간 기준 사용 권장
- 프론트엔드에서 표시할 때는 브라우저의 로컬 시간으로 자동 변환됨
