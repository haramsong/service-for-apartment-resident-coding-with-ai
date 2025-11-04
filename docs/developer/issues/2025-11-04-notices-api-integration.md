# 공지사항 API 연동 작업

*작성일: 2025-11-04*

*작성자: Developer Agent*

## 작업 개요

홈페이지에 공지사항 API를 연동하여 실제 데이터베이스의 공지사항을 표시하도록 구현했습니다.

## 구현 내용

### 1. API 쿼리 추가

```typescript
// 최근 공지사항 가져오기
const { data: recentNotices } = trpc.notices.getList.useQuery({
  apartmentId: session?.user?.apartmentId || '',
  page: 1,
  limit: 3,
}, {
  enabled: !!session?.user?.apartmentId,
})

// 긴급 공지사항 가져오기
const { data: urgentNotices } = trpc.notices.getList.useQuery({
  apartmentId: session?.user?.apartmentId || '',
  page: 1,
  limit: 1,
  isUrgent: true,
}, {
  enabled: !!session?.user?.apartmentId,
})
```

### 2. 긴급 알림 배너 연동

- 긴급 공지사항이 있을 때만 배너 표시
- 실제 공지사항 데이터로 제목과 내용 표시
- "자세히 보기" 버튼 클릭 시 해당 공지사항 상세 페이지로 이동

### 3. 공지사항 목록 연동

- 더미 데이터를 실제 API 데이터로 교체
- 로딩 상태 처리 추가
- 빈 데이터 상태 처리 추가
- 시간 표시를 `formatTimeAgo` 함수로 동적 계산

### 4. UI 개선

- 긴급 공지와 일반 공지 구분 표시
- 배지 스타일 간소화 (긴급/안내)
- 반응형 디자인 유지

## 기술적 세부사항

### tRPC 쿼리 옵션

```typescript
{
  enabled: !!session?.user?.apartmentId,
}
```

- 사용자가 로그인하고 아파트 ID가 있을 때만 쿼리 실행
- 불필요한 API 호출 방지

### 조건부 렌더링

```typescript
{urgentNotice && (
  // 긴급 알림 배너
)}

{!recentNotices ? (
  // 로딩 상태
) : recentNotices.items.length === 0 ? (
  // 빈 데이터
) : (
  // 데이터 표시
)}
```

## 발생한 문제 및 해결

### 문제 1: 중복 코드

**증상**: 긴급 알림 배너의 닫는 태그가 중복되어 빌드 에러 발생

**원인**: 이전 수정 작업에서 코드가 중복으로 남아있었음

**해결**: 중복된 코드 블록 제거

### 문제 2: 타입 안전성

**증상**: `notice.isImportant` 속성이 존재하지 않음

**원인**: API 응답 타입에는 `isUrgent`만 있고 `isImportant`는 없음

**해결**: `isUrgent`로 통일하여 사용

## 테스트 결과

- ✅ 빌드 성공
- ✅ 공지사항 목록 정상 표시
- ✅ 긴급 공지사항 배너 조건부 표시
- ✅ 로딩 상태 처리
- ✅ 빈 데이터 상태 처리

## 다음 단계

1. 공지사항 상세 페이지 구현
2. 공지사항 작성 페이지 (관리자 전용)
3. 공지사항 수정/삭제 기능
4. 공지사항 검색 기능

## 참고 문서

- `/docs/developer/api-specification.md` - API 명세서
- `/src/server/trpc/routers/notices.ts` - 공지사항 라우터
