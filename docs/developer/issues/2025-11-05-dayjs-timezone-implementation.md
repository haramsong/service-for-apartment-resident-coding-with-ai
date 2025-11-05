# Date 객체를 dayjs로 변경 및 서울 타임존 적용

_작성일: 2025-11-05_

_작성자: Developer Agent_

## 문제 상황

- 기존 코드에서 `new Date()` 객체를 직접 사용하여 날짜/시간 처리
- 타임존 처리가 일관되지 않아 서버와 클라이언트 간 시간 불일치 가능성
- 날짜 포맷팅 로직이 각 파일마다 중복 구현됨

## 원인 분석

1. **타임존 문제**: JavaScript의 `Date` 객체는 로컬 타임존을 사용하여 서버/클라이언트 환경에 따라 다른 결과 발생
2. **코드 중복**: 날짜 포맷팅 함수가 여러 파일에 중복 구현됨
3. **유지보수성**: 날짜 처리 로직 변경 시 모든 파일을 수정해야 함

## 해결 방법

### 1. dayjs 라이브러리 설치

```bash
bun add dayjs
```

### 2. dayjs 설정 파일 생성

`src/lib/dayjs.ts` 파일 생성:

```typescript
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ko'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.locale('ko')

export const getKSTDate = (date?: string | Date) => {
  return dayjs(date).tz('Asia/Seoul')
}

export default dayjs
```

### 3. 클라이언트 코드 변경

**변경 전:**
```typescript
const formatTimeAgo = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  // ... 복잡한 로직
}
```

**변경 후:**
```typescript
import { getKSTDate } from '@/lib/dayjs'

const formatTimeAgo = (date: Date) => {
  return getKSTDate(date).fromNow()
}
```

### 4. 서버 코드 변경

**변경 전:**
```typescript
const [year, month, day] = input.date.split('-').map(Number)
const queryDate = new Date(year, month - 1, day)
```

**변경 후:**
```typescript
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

const queryDate = dayjs.tz(input.date, 'Asia/Seoul').startOf('day').toDate()
```

## 적용된 파일 목록

### 클라이언트 (9개 파일)
1. `src/app/page.tsx` - 홈페이지
2. `src/app/community/page.tsx` - 커뮤니티 목록
3. `src/app/community/[id]/page.tsx` - 게시글 상세
4. `src/app/notices/page.tsx` - 공지사항 목록
5. `src/app/notices/[id]/page.tsx` - 공지사항 상세
6. `src/app/reservation/page.tsx` - 예약 페이지
7. `src/components/features/ReservationDialog.tsx` - 예약 다이얼로그

### 서버 (1개 파일)
1. `src/server/trpc/routers/reservations.ts` - 예약 라우터

## 주요 개선 사항

### 1. 타임존 일관성
- 모든 날짜/시간 처리가 서울 타임존(Asia/Seoul) 기준으로 통일
- 서버와 클라이언트 간 시간 불일치 문제 해결

### 2. 코드 간결화
- `formatTimeAgo` 함수: 10줄 → 1줄
- `formatDate` 함수: 3줄 → 1줄

### 3. 다국어 지원
- dayjs 한국어 로케일 적용
- "3분 전", "2시간 전" 등 자연스러운 한국어 표현

### 4. 유지보수성 향상
- 중앙 집중식 날짜 처리 로직
- 날짜 포맷 변경 시 한 곳만 수정

## 예방 방법

### 1. 새로운 날짜 처리 시 규칙

```typescript
// ❌ 사용하지 말 것
const now = new Date()
const date = new Date(dateString)

// ✅ 사용할 것
import { getKSTDate } from '@/lib/dayjs'
const now = getKSTDate()
const date = getKSTDate(dateString)
```

### 2. 날짜 포맷팅

```typescript
// 상대 시간
getKSTDate(date).fromNow() // "3분 전"

// 특정 포맷
getKSTDate(date).format('YYYY.MM.DD') // "2025.11.05"
getKSTDate(date).format('YYYY년 M월 D일') // "2025년 11월 5일"
```

### 3. 날짜 비교

```typescript
// ❌ 사용하지 말 것
date1.getTime() === date2.getTime()

// ✅ 사용할 것
getKSTDate(date1).isSame(getKSTDate(date2), 'day')
getKSTDate(date1).isAfter(getKSTDate(date2))
getKSTDate(date1).isBefore(getKSTDate(date2))
```

## 테스트 결과

- ✅ 빌드 성공
- ✅ 모든 날짜 표시가 한국어로 정상 출력
- ✅ 타임존 일관성 확보
- ✅ 코드 중복 제거

## 참고 자료

- [Day.js 공식 문서](https://day.js.org/)
- [Day.js Timezone 플러그인](https://day.js.org/docs/en/plugin/timezone)
- [Day.js RelativeTime 플러그인](https://day.js.org/docs/en/plugin/relative-time)
