# 댓글 작성 React Hook 오류 해결

*작성일: 2025-11-03*

*작성자: Developer Agent*

*이슈 유형: 버그 수정*

*우선순위: High*

## 🐛 문제 상황

### 발생한 오류
게시글 상세 페이지에서 댓글 작성 시 React Hook 규칙 위반 오류 발생:
```
React Hook "trpc.useContext" is called in function that is neither a React function component nor a custom React Hook function
```

### 문제점
- `trpc.useContext()`를 mutation의 콜백 함수 내부에서 직접 호출
- React Hook은 컴포넌트 최상위 레벨에서만 호출 가능

## 🔍 원인 분석

### 잘못된 코드
```typescript
const createComment = trpc.posts.createComment.useMutation({
  onSuccess: () => {
    // ❌ Hook을 콜백 내부에서 호출
    trpc.useContext().posts.getById.invalidate({ id: resolvedParams.id })
  }
})
```

### React Hook 규칙
- Hook은 컴포넌트 최상위 레벨에서만 호출 가능
- 조건문, 반복문, 중첩 함수 내부에서 호출 불가
- 콜백 함수도 중첩 함수에 해당

## ✅ 해결 방법

### 수정된 코드
```typescript
// ✅ 컴포넌트 최상위에서 Hook 호출
const utils = trpc.useContext()

const createComment = trpc.posts.createComment.useMutation({
  onSuccess: () => {
    setComment('')
    setIsAnonymous(false)
    // utils 변수 사용
    utils.posts.getById.invalidate({ id: resolvedParams.id })
  }
})

const likePost = trpc.posts.like.useMutation({
  onSuccess: () => {
    utils.posts.getById.invalidate({ id: resolvedParams.id })
  }
})
```

## 📊 해결 결과

### 적용된 변경사항
- ✅ `trpc.useContext()`를 컴포넌트 최상위에서 호출
- ✅ `utils` 변수에 저장하여 콜백에서 재사용
- ✅ React Hook 규칙 준수

### 테스트 확인
- 댓글 작성 정상 동작
- 쿼리 무효화로 자동 새로고침
- React Hook 오류 해결

## 🔄 예방 방법

### 1. React Hook 규칙 준수
- Hook은 항상 컴포넌트 최상위에서 호출
- 콜백이나 조건문 내부에서 Hook 호출 금지
- ESLint의 `react-hooks/rules-of-hooks` 규칙 활용

### 2. tRPC useContext 패턴
```typescript
// ✅ 올바른 패턴
const utils = trpc.useContext()

// mutation에서 사용
const mutation = trpc.something.useMutation({
  onSuccess: () => {
    utils.something.invalidate()
  }
})
```

### 3. 코드 리뷰 체크리스트
- [ ] Hook이 컴포넌트 최상위에서 호출되는가?
- [ ] 콜백 내부에서 Hook을 직접 호출하지 않는가?
- [ ] ESLint 경고가 없는가?

## 📚 참고 문서
- [React Hook 규칙](https://react.dev/reference/rules/rules-of-hooks)
- [tRPC useContext](https://trpc.io/docs/client/react/useContext)

---

*React Hook 규칙을 준수하여 댓글 작성 기능이 정상 동작합니다.*
