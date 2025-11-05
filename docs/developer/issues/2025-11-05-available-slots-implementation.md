# 예약 가능 시간대 조회 기능 구현

_작성일: 2025-11-05_

_작성자: Developer Agent_

## 작업 내용

`getAvailableSlots` API의 TODO 부분을 구현하여 실제 예약 가능한 시간대를 조회할 수 있도록 개선했습니다.

## 구현 내용

### 1. 시설 정보 조회
- 시설 ID로 시설 정보를 조회하여 운영시간 확인
- 시설이 없을 경우 NOT_FOUND 에러 반환

### 2. 기존 예약 조회
- 해당 날짜의 confirmed 상태 예약만 조회
- 취소된 예약은 제외

### 3. 시간 슬롯 생성
- 운영시간 기반으로 1시간 단위 슬롯 생성
- 기본 운영시간: 09:00-22:00
- 시설별 커스터마이징 가능 (operatingHours JSON 필드)

### 4. 예약 가능 여부 체크
- 각 슬롯의 startTime과 기존 예약의 startTime 비교
- 예약이 있으면 isAvailable: false
- 예약이 없으면 isAvailable: true

## 코드 예시

```typescript
// 운영시간 파싱 (기본값: 09:00-22:00)
const operatingHours = facility.operatingHours as { start: string; end: string } | null
const startHour = operatingHours?.start ? parseInt(operatingHours.start.split(':')[0]) : 9
const endHour = operatingHours?.end ? parseInt(operatingHours.end.split(':')[0]) : 22

// 1시간 단위 슬롯 생성
const slots = []
for (let hour = startHour; hour < endHour; hour++) {
  const startTime = `${hour.toString().padStart(2, '0')}:00`
  const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`

  const isReserved = reservations.some(
    (r) => r.startTime === startTime
  )

  slots.push({
    startTime,
    endTime,
    isAvailable: !isReserved,
  })
}
```

## 반환 데이터 형식

```typescript
{
  date: "2025-11-05",
  slots: [
    { startTime: "09:00", endTime: "10:00", isAvailable: true },
    { startTime: "10:00", endTime: "11:00", isAvailable: false },
    // ...
  ]
}
```

## 개선 가능한 부분

1. **다양한 시간 단위**: 현재는 1시간 단위만 지원. 30분, 2시간 단위 등 추가 가능
2. **시간대 겹침 체크**: 현재는 정확히 같은 startTime만 체크. 시간대 겹침 로직 추가 가능
3. **캐싱**: 자주 조회되는 날짜의 슬롯 정보를 Redis에 캐싱하여 성능 개선 가능

## 테스트 방법

1. 예약 페이지에서 시설 선택
2. 날짜 선택
3. 예약 가능한 시간대 목록 확인
4. 이미 예약된 시간은 비활성화 상태로 표시

## 영향 범위

- `src/server/trpc/routers/reservations.ts` 파일 수정
- 예약 Dialog 컴포넌트에서 실제 데이터 표시 가능
- 사용자가 예약 가능한 시간대를 정확히 확인 가능
