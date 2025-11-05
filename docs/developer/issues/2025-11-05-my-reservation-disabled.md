# 예약 시간 선택 시 본인 예약 Disabled 처리

_작성일: 2025-11-05_

_작성자: Developer Agent_

## 문제 상황

예약 Dialog에서 시간 선택 시 본인이 이미 예약한 시간도 선택 가능한 상태였습니다. 이로 인해 사용자가 실수로 같은 시간에 중복 예약을 시도할 수 있는 문제가 있었습니다.

## 원인 분석

1. **API 응답 부족**: `getAvailableSlots` API가 본인 예약 여부를 반환하지 않음
2. **UI 구분 없음**: 본인 예약 시간과 다른 사람 예약 시간의 시각적 구분이 없음
3. **인증 미적용**: API가 `publicProcedure`로 되어 있어 사용자 정보를 활용할 수 없음

## 해결 방법

### 1. API 수정 (reservations.ts)

```typescript
// publicProcedure → protectedProcedure로 변경
getAvailableSlots: protectedProcedure
  .input(...)
  .query(async ({ input, ctx }) => {
    // 본인 예약 여부 확인 로직 추가
    const isMyReservation = reservations.some(
      (r) =>
        r.startTime.getTime() === slotStart.getTime() &&
        r.userId === ctx.session.user.id
    );

    slots.push({
      startTime,
      endTime,
      isAvailable: !isFull,
      isMyReservation, // 새로 추가
      currentCount: reservationCount,
      capacity: facility.capacity,
    });
  });
```

### 2. UI 수정 (ReservationDialog.tsx)

```typescript
// 본인 예약 시간은 비활성화
const isSlotAvailable = (slot: any) => {
  if (slot.isMyReservation) return false; // 추가
  if (!slot.isAvailable) return false;
  // ... 기존 로직
};

// 본인 예약 시간 시각적 구분
const isMySlot = slot.isMyReservation;
className={`
  ${isMySlot
    ? "bg-green-50 text-green-700 border-green-300 cursor-not-allowed"
    : // ... 기존 스타일
  }
`}

// '내 예약' 라벨 표시
{isMySlot ? (
  <span className="text-xs">내 예약</span>
) : showCapacity ? (
  <span className="text-xs">{slot.currentCount}/{slot.capacity}</span>
) : null}
```

## 개선 효과

1. **중복 예약 방지**: 본인 예약 시간은 클릭 불가능
2. **시각적 구분**: 초록색 배경으로 본인 예약 시간 명확히 표시
3. **사용자 경험 개선**: '내 예약' 라벨로 직관적인 정보 제공
4. **데이터 정확성**: 인증된 사용자 정보 기반으로 정확한 예약 상태 표시

## 예방 방법

1. **API 설계 시 고려사항**:
   - 사용자별 데이터는 항상 `protectedProcedure` 사용
   - 응답에 사용자 관련 메타데이터 포함 (isMyReservation 등)

2. **UI 설계 시 고려사항**:
   - 사용자 본인 데이터는 시각적으로 구분
   - Disabled 상태에 대한 명확한 라벨 제공

3. **테스트 체크리스트**:
   - [ ] 본인 예약 시간 클릭 불가능 확인
   - [ ] 본인 예약 시간 시각적 구분 확인
   - [ ] 다른 사용자 예약 시간 정상 동작 확인
   - [ ] 예약 가능 시간 정상 선택 확인

## 관련 파일

- `src/server/trpc/routers/reservations.ts`
- `src/components/features/ReservationDialog.tsx`
