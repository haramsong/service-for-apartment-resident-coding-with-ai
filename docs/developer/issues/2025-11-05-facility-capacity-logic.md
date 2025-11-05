# 시설 정원 초과 시 시간 선택 불가 로직 구현

_작성일: 2025-11-05_

_작성자: Developer Agent_

## 문제 상황

기존 예약 시스템에서는 시설의 정원(capacity)을 고려하지 않고 단순히 1개의 예약만 가능했습니다. 이로 인해 여러 명이 동시에 사용할 수 있는 시설(예: 헬스장, 독서실)의 경우 정원 관리가 불가능했습니다.

## 원인 분석

1. **getAvailableSlots API**: 단순히 예약 존재 여부만 확인 (`isReserved`)
2. **create API**: 중복 예약만 체크, 정원 초과 검증 없음
3. **UI**: 정원 정보 표시 없음

## 해결 방법

### 1. getAvailableSlots API 개선

```typescript
// 해당 시간대 예약 수 계산
const reservationCount = reservations.filter(
  (r) => r.startTime.getTime() === startDateTime.getTime()
).length

// 정원 초과 여부 확인
const isFull = facility.capacity 
  ? reservationCount >= facility.capacity 
  : reservationCount > 0

slots.push({
  startTime,
  endTime,
  isAvailable: !isFull,
  currentCount: reservationCount,
  capacity: facility.capacity,
})
```

**변경 사항**:
- 예약 수를 카운트하여 정원과 비교
- `currentCount`와 `capacity` 정보를 응답에 포함
- capacity가 null이면 기존 로직 유지 (1명만 가능)

### 2. create API 정원 검증 추가

```typescript
// 시설 정보 조회
const facility = await prisma.facility.findUnique({
  where: { id: input.facilityId },
})

// 해당 시간대 예약 수 확인
const existingReservations = await prisma.reservation.findMany({
  where: {
    facilityId: input.facilityId,
    date: reservationDate,
    startTime: startDateTime,
    status: 'confirmed',
  },
})

// 정원 초과 확인
if (facility.capacity && existingReservations.length >= facility.capacity) {
  throw new TRPCError({
    code: 'CONFLICT',
    message: '해당 시간대 정원이 초과되었습니다',
  })
}
```

**변경 사항**:
- 예약 생성 전 정원 초과 여부 검증
- 정원 초과 시 명확한 에러 메시지 반환

### 3. UI 정원 정보 표시

```typescript
{showCapacity && (
  <span className="text-xs">
    {slot.currentCount}/{slot.capacity}
  </span>
)}
```

**변경 사항**:
- 정원이 2명 이상인 시설만 정원 정보 표시
- 현재 예약 수 / 총 정원 형식으로 표시

## 테스트 시나리오

1. **정원 1명 시설 (헬스장 러닝머신)**:
   - 1명 예약 시 해당 시간 비활성화
   - 정원 정보 미표시

2. **정원 10명 시설 (독서실)**:
   - 10명까지 예약 가능
   - 각 시간대에 "현재예약수/10" 표시
   - 10명 도달 시 해당 시간 비활성화

3. **정원 null 시설**:
   - 기존 로직 유지 (1명만 가능)

## 예방 방법

1. **시설 생성 시 정원 필수 입력**: 관리자가 시설 등록 시 정원을 명확히 설정
2. **실시간 정원 업데이트**: 예약 생성/취소 시 즉시 UI 반영
3. **동시성 제어**: 트랜잭션으로 동시 예약 시 정원 초과 방지

## 영향 범위

- ✅ 백엔드 API: `reservations.ts`
- ✅ 프론트엔드 UI: `ReservationDialog.tsx`
- ✅ 데이터베이스: 기존 스키마 활용 (변경 없음)

## 추가 개선 사항

1. **대기 예약 시스템**: 정원 초과 시 대기 예약 기능
2. **알림 시스템**: 대기 예약자에게 취소 발생 시 알림
3. **통계 기능**: 시설별 이용률 분석
