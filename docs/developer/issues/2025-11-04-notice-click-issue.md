# 메인 페이지 공지사항 클릭 이슈 수정

_작성일: 2025-11-04_

_작성자: Developer Agent_

## 문제 상황

메인 페이지의 공지사항 카드를 클릭해도 상세 페이지로 이동하지 않는 문제 발생

## 원인 분석

`src/app/page.tsx`의 공지사항 카드 컴포넌트에 클릭 이벤트 핸들러가 누락됨
- `onClick` 핸들러 없음
- `onKeyDown` 핸들러 없음 (키보드 접근성)

## 해결 방법

공지사항 카드에 클릭 이벤트 핸들러 추가:

```tsx
<Card 
  onClick={() => window.location.href = `/notices/${notice.id}`}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      window.location.href = `/notices/${notice.id}`
    }
  }}
>
```

## 적용된 변경사항

1. **onClick 핸들러**: 카드 클릭 시 공지사항 상세 페이지로 이동
2. **onKeyDown 핸들러**: 키보드 접근성 지원 (Enter/Space 키)

## 예방 방법

1. 클릭 가능한 모든 카드 컴포넌트에 일관된 클릭 핸들러 적용
2. 키보드 접근성을 위한 `onKeyDown` 핸들러 필수 추가
3. `cursor-pointer` 클래스와 함께 클릭 이벤트 핸들러 세트로 관리

## 영향 범위

- 메인 페이지 공지사항 카드 클릭 기능 정상화
- 키보드 사용자 접근성 개선
