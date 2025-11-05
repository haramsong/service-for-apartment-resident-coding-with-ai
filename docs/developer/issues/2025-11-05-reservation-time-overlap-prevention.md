# 본인 예약 시간 겹침 방지 로직 구현

_작성일: 2025-11-05_

_작성자: Developer Agent_

## 문제 상황

사용자가 같은 날짜에 여러 시설을 예약할 때, 시간이 겹치는 예약을 할 수 있는 문제가 있었습니다.

예시:
- 헬스장: 14:00-15:00 예약
- 독서실: 14:30-15:30 예약 (시간 겹침 발생)

## 원인 분석

기존 `reservations.create` mutation에서는 시설별 중복만 확인했고, 사용자의 다른 시설 예약과의 시간 겹침은 확인하지 않았습니다.

```typescript
// 기존 코드 - 시설별 중복만 확인
const existing = await prisma.reservation.findFirst({
  where: {
    facilityId: input.facilityId,
    date: new Date(input.date),
    startTime: startDateTime,
  },
})
```

## 해결 방법

1. **본인의 같은 날짜 예약 조회**
   ```typescript
   const myReservations = await prisma.reservation.findMany({
     where: {
       userId: ctx.session.user.id,
       date: reservationDate,
       status: 'confirmed',
     },
   })
   ```

2. **시간 겹침 검증 로직**
   ```typescript
   for (const existing of myReservations) {
     const existingStart = existing.startTime.getTime()
     const existingEnd = existing.endTime.getTime()
     const newStart = startDateTime.getTime()
     const newEnd = endDateTime.getTime()

     // 시간 겹침 조건: 새 예약 시작 < 기존 예약 종료 AND 새 예약 종료 > 기존 예약 시작
     if (newStart < existingEnd && newEnd > existingStart) {
       throw new TRPCError({
         code: 'CONFLICT',
         message: '이미 해당 시간에 다른 예약이 있습니다',
       })
     }
   }
   ```

3. **검증 순서**
   - 본인 시간 겹침 확인 (먼저)
   - 시설 중복 예약 확인 (나중)

## 적용 결과

- 사용자가 같은 날짜에 시간이 겹치는 예약을 시도하면 "이미 해당 시간에 다른 예약이 있습니다" 에러 발생
- 시설이 다르더라도 시간 겹침 방지
- 사용자 경험 개선 및 예약 충돌 방지

## 예방 방법

1. **프론트엔드 검증 추가**: 예약 Dialog에서 사용자의 기존 예약 시간을 표시하여 사전에 겹침 방지
2. **캘린더 UI 개선**: 이미 예약된 시간대를 시각적으로 표시
3. **예약 가능 시간 API**: 사용자의 기존 예약을 고려한 예약 가능 시간 제공

## 관련 파일

- `/src/server/trpc/routers/reservations.ts` - 예약 라우터 (시간 겹침 검증 로직 추가)
