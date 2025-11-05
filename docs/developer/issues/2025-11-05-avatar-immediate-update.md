# 프로필 사진 업로드 즉시 반영 개선

_작성일: 2025-11-05_

_작성자: Developer Agent_

## 문제 상황

프로필 사진 업로드 후 `update()` 호출로 세션을 업데이트했지만, UI에 즉시 반영되지 않는 문제가 발생했습니다.

### 증상
- 아바타 업로드 성공
- 데이터베이스에 URL 저장 완료
- 세션 업데이트 호출 완료
- **하지만 UI에는 이전 이미지가 계속 표시됨**

## 원인 분석

### 1. 세션 업데이트 타이밍
```typescript
await updateAvatar.mutateAsync({ avatar: url });
await update(); // 세션 업데이트
// 하지만 React 리렌더링이 즉시 발생하지 않음
```

### 2. NextAuth 세션 동기화 지연
- `update()` 함수는 비동기적으로 세션을 갱신
- 서버와의 통신 후 세션 상태가 업데이트됨
- React 컴포넌트 리렌더링까지 약간의 지연 발생

## 해결 방법

### 로컬 상태로 즉시 UI 업데이트

```typescript
// 1. 로컬 상태 추가
const [avatarUrl, setAvatarUrl] = useState<string | null>(
  session?.user?.avatar || null
);

// 2. 세션 변경 시 동기화
useEffect(() => {
  if (session?.user?.avatar) {
    setAvatarUrl(session.user.avatar);
  }
}, [session?.user?.avatar]);

// 3. 업로드 성공 시 즉시 반영
const { url } = await response.json();
await updateAvatar.mutateAsync({ avatar: url });
setAvatarUrl(url); // 즉시 UI 업데이트
await update(); // 세션도 업데이트

// 4. 렌더링에 로컬 상태 사용
{avatarUrl ? (
  <Image src={avatarUrl} ... />
) : (
  <User />
)}
```

## 개선 효과

### Before
1. 업로드 완료
2. 세션 업데이트 대기
3. 리렌더링 대기
4. **사용자는 변화를 즉시 확인 못함**

### After
1. 업로드 완료
2. **즉시 UI 업데이트** (로컬 상태)
3. 백그라운드에서 세션 동기화
4. **사용자는 즉각적인 피드백 확인**

## 예방 방법

### 1. 낙관적 업데이트 패턴 사용
```typescript
// 서버 응답 전에 UI 먼저 업데이트
setAvatarUrl(optimisticUrl);
try {
  await serverUpdate();
} catch {
  setAvatarUrl(previousUrl); // 실패 시 롤백
}
```

### 2. 로컬 상태 + 서버 상태 조합
- 즉각적인 피드백: 로컬 상태
- 데이터 일관성: 서버 상태 (세션)
- useEffect로 자동 동기화

### 3. 사용자 경험 우선
- 서버 응답을 기다리지 않고 UI 먼저 업데이트
- 로딩 상태 표시로 진행 상황 전달
- 에러 발생 시 명확한 피드백

## 관련 파일

- `src/app/my/page.tsx`: 프로필 페이지 컴포넌트

## 참고사항

이 패턴은 다른 실시간 업데이트가 필요한 기능에도 적용 가능합니다:
- 게시글 좋아요
- 댓글 작성
- 프로필 정보 수정
