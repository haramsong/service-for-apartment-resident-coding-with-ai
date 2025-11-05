# 예약 시간 선택 제한 로직 구현

_작성일: 2025-11-05_

_작성자: Developer Agent_

## 문제 상황

예약 시스템에서 시간 선택 시 다음과 같은 제한이 필요했습니다:
1. 과거 날짜 선택 불가
2. 오늘 날짜의 경우 현재 시간 이후만 선택 가능
3. 최대 예약 가능 기간 제한 (30일 이내)

## 구현 내용

### 1. 날짜 제한 로직

```typescript
const today = new Date();
today.setHours(0, 0, 0, 0);
const maxDate = new Date(today);
maxDate.setDate(maxDate.getDate() + 30); // 30일 이내만 예약 가능

const isDateDisabled = (checkDate: Date) => {
  const dateOnly = new Date(checkDate);
  dateOnly.setHours(0, 0, 0, 0);
  return dateOnly < today || dateOnly > maxDate;
};
```

- 오늘 날짜 이전 선택 불가
- 30일 이후 날짜 선택 불가
- Calendar 컴포넌트의 `disabled` prop에 적용

### 2. 시간 제한 로직

```typescript
const isSlotAvailable = (slot: any) => {
  if (!slot.isAvailable) return false;
  if (!date) return false;

  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  // 오늘이 아니면 모든 시간 선택 가능
  if (selectedDate.getTime() !== todayDate.getTime()) return true;

  // 오늘인 경우 현재 시간 이후만 선택 가능
  const now = new Date();
  const [startHour, startMinute] = slot.startTime.split(":").map(Number);
  const slotTime = new Date();
  slotTime.setHours(startHour, startMinute, 0, 0);

  return slotTime > now;
};
```

- 오늘 날짜가 아닌 경우: 모든 시간대 선택 가능
- 오늘 날짜인 경우: 현재 시간 이후만 선택 가능
- 이미 예약된 시간은 선택 불가

### 3. UI 개선

- 날짜 선택 라벨에 "30일 이내" 안내 추가
- 오늘 날짜 선택 시 "현재 시간 이후만 선택 가능" 힌트 표시
- 선택 불가능한 시간대는 회색으로 표시 및 비활성화

## 영향

### 사용자 경험
- 선택 불가능한 날짜/시간을 명확히 구분
- 예약 실패 가능성 감소
- 직관적인 안내 메시지 제공

### 시스템
- 유효하지 않은 예약 요청 방지
- 서버 부하 감소
- 데이터 정합성 향상

## 테스트 방법

1. **과거 날짜 테스트**
   - Calendar에서 오늘 이전 날짜 선택 시도
   - 선택 불가능해야 함

2. **30일 이후 날짜 테스트**
   - Calendar에서 30일 이후 날짜 선택 시도
   - 선택 불가능해야 함

3. **오늘 날짜 시간 제한 테스트**
   - 오늘 날짜 선택
   - 현재 시간 이전 시간대는 비활성화되어야 함
   - 현재 시간 이후 시간대만 선택 가능해야 함

4. **미래 날짜 테스트**
   - 내일 이후 날짜 선택
   - 모든 시간대 선택 가능해야 함

## 예방 방법

- 날짜/시간 관련 로직은 항상 타임존 고려
- 서버 시간과 클라이언트 시간 차이 고려
- 백엔드에서도 동일한 검증 로직 구현 필요
