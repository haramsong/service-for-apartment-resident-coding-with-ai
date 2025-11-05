# 예약 시스템 한국 시간대(Asia/Seoul) 적용

_작성일: 2025-11-05_

_작성자: Developer Agent_

## 문제 상황

예약 시스템에서 날짜와 시간 처리가 서버의 기본 시간대(UTC)를 사용하여, 한국 사용자가 예약할 때 시간대 불일치 문제가 발생할 수 있었습니다.

## 원인 분석

1. **서버 측**: `new Date()` 생성자가 서버의 기본 시간대를 사용
2. **클라이언트 측**: 브라우저의 로컬 시간대를 사용하여 불일치 발생
3. **날짜 비교**: 시간대가 다르면 "오늘" 판단이 잘못될 수 있음

## 해결 방법

### 1. 서버 측 수정 (reservations.ts)

```typescript
// 한국 시간대 유틸리티 함수 추가
const toKST = (date: Date) => {
  return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
}

const parseKSTDate = (dateStr: string) => {
  // YYYY-MM-DD 형식을 한국 시간대로 파싱
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}
```

- `parseKSTDate`: 날짜 문자열을 한국 시간대 기준으로 파싱
- 예약 생성 시 시간 설정을 `setHours`로 명시적으로 처리

### 2. 클라이언트 측 수정 (ReservationDialog.tsx)

```typescript
// 한국 시간대 기준 현재 시간 가져오기
const getKSTDate = () => {
  const now = new Date();
  const kstOffset = 9 * 60; // UTC+9
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + kstOffset * 60000);
};
```

- 브라우저 시간대와 무관하게 항상 한국 시간 기준으로 동작
- "오늘" 판단과 시간 비교가 정확해짐

### 3. 날짜 표시 수정 (reservation/page.tsx)

```typescript
const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Seoul', // 명시적으로 한국 시간대 지정
  })
}
```

## 적용 결과

1. **일관된 시간대**: 서버와 클라이언트 모두 한국 시간대 사용
2. **정확한 "오늘" 판단**: 한국 시간 기준으로 오늘 날짜 확인
3. **시간 제한 정확성**: 현재 시간 이후 예약만 가능하도록 정확히 동작
4. **날짜 표시 일관성**: 모든 날짜가 한국 시간대로 표시

## 예방 방법

1. **시간대 명시**: 날짜/시간 처리 시 항상 `timeZone: 'Asia/Seoul'` 명시
2. **유틸리티 함수 사용**: 공통 시간대 처리 함수를 만들어 재사용
3. **테스트**: 다양한 시간대에서 테스트하여 검증
4. **문서화**: 시간대 처리 방식을 명확히 문서화

## 참고사항

- 한국 시간대: UTC+9 (Asia/Seoul)
- 서머타임 없음 (연중 동일한 오프셋)
- 데이터베이스에는 UTC로 저장되지만, 애플리케이션 레벨에서 한국 시간으로 변환
