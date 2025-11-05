# 예약 생성 시 startTime DateTime 타입 에러 수정

_작성일: 2025-11-05_

_작성자: Developer Agent_

## 문제 상황

예약 생성 API 호출 시 다음과 같은 타입 에러 발생:

```
Argument `startTime`: Invalid value provided. Expected DateTime, provided String.
```

## 원인 분석

1. **Prisma 스키마**: `startTime`과 `endTime`이 `DateTime` 타입으로 정의됨
   ```prisma
   startTime  DateTime @map("start_time") @db.Time(6)
   endTime    DateTime @map("end_time") @db.Time(6)
   ```

2. **코드 구현**: 문자열 형태("09:00")를 직접 저장하려고 시도
   ```typescript
   startTime: input.startTime, // "09:00" 문자열
   ```

3. **타입 불일치**: PostgreSQL의 `TIME` 타입은 Prisma에서 `DateTime` 객체로 처리되어야 함

## 해결 방법

### 1. 예약 생성 시 시간 변환

문자열 시간을 DateTime 객체로 변환:

```typescript
// 시간 문자열을 DateTime으로 변환
const startDateTime = new Date(`1970-01-01T${input.startTime}:00`)
const endDateTime = new Date(`1970-01-01T${input.endTime}:00`)

const reservation = await prisma.reservation.create({
  data: {
    startTime: startDateTime,
    endTime: endDateTime,
    // ...
  },
})
```

### 2. 예약 가능 시간 조회 시 비교 로직 수정

DateTime 객체 간 비교로 변경:

```typescript
const startDateTime = new Date(`1970-01-01T${startTime}:00`)

const isReserved = reservations.some(
  (r) => r.startTime.getTime() === startDateTime.getTime()
)
```

## 수정된 파일

- `src/server/trpc/routers/reservations.ts`
  - `create` mutation: 시간 문자열 → DateTime 변환 추가
  - `getAvailableSlots` query: DateTime 비교 로직 수정

## 테스트 방법

1. 예약 페이지에서 시설 선택
2. 날짜 및 시간 선택
3. 예약 생성 버튼 클릭
4. 에러 없이 예약 생성 확인

## 예방 방법

1. **타입 일관성**: Prisma 스키마의 타입과 코드의 타입을 일치시킴
2. **타입 변환 유틸**: 시간 문자열 ↔ DateTime 변환 유틸 함수 작성 고려
3. **테스트 코드**: 타입 변환 로직에 대한 단위 테스트 추가

## 참고

- PostgreSQL `TIME` 타입은 Prisma에서 `DateTime` 객체로 처리
- 날짜 부분은 무시되고 시간 부분만 저장됨
- `1970-01-01`을 기준 날짜로 사용하여 시간만 표현
