# JWT 토큰 리프레시 구현

_작성일: 2025-11-05_

_작성자: Developer Agent_

## 문제 상황

프로필 사진 업로드 후 `update()` 함수를 호출했지만, NextAuth 세션의 아바타 정보가 자동으로 업데이트되지 않는 문제가 발생했습니다.

### 증상
- 아바타 업로드 후 `session.user.avatar`가 이전 값 유지
- 페이지 새로고침 후에야 새 아바타 표시
- `update()` 호출이 세션을 갱신하지 못함

## 원인 분석

NextAuth의 JWT 전략을 사용할 때, `update()` 함수는 기본적으로 JWT 토큰을 재생성하지 않습니다. JWT 콜백에서 `trigger` 파라미터를 확인하여 명시적으로 최신 데이터를 가져와야 합니다.

### 기존 코드 문제점
```typescript
async jwt({ token, user }) {
  if (user) {
    // 로그인 시에만 사용자 정보 설정
    token.avatar = user.avatar
  }
  return token
}
```

## 해결 방법

NextAuth의 `jwt` 콜백에 `trigger` 파라미터를 추가하고, `trigger === 'update'` 시 데이터베이스에서 최신 사용자 정보를 조회하도록 구현했습니다.

### 수정된 코드
```typescript
async jwt({ token, user, trigger }) {
  if (user) {
    token.apartmentId = user.apartmentId
    token.dong = user.dong
    token.ho = user.ho
    token.role = user.role
    token.avatar = user.avatar
  }
  
  // update() 호출 시 최신 사용자 정보 가져오기
  if (trigger === 'update' && token.sub) {
    const updatedUser = await prisma.user.findUnique({
      where: { id: token.sub },
      select: { avatar: true }
    })
    if (updatedUser) {
      token.avatar = updatedUser.avatar
    }
  }
  
  return token
}
```

## 구현 세부사항

### 1. trigger 파라미터 활용
- `trigger === 'update'`: `update()` 함수 호출 시
- `token.sub`: 사용자 ID (JWT 표준 클레임)

### 2. 최소한의 DB 쿼리
- `select: { avatar: true }`: 아바타 필드만 조회하여 성능 최적화

### 3. 안전한 업데이트
- `if (updatedUser)`: null 체크로 안전성 확보

## 동작 흐름

1. 사용자가 아바타 업로드
2. `updateAvatar.mutateAsync()` 호출 → DB 업데이트
3. `update()` 호출 → NextAuth 세션 갱신 트리거
4. JWT 콜백에서 `trigger === 'update'` 감지
5. DB에서 최신 아바타 정보 조회
6. JWT 토큰에 새 아바타 URL 반영
7. 세션 콜백에서 `session.user.avatar` 업데이트
8. 클라이언트에서 즉시 새 아바타 표시

## 테스트 방법

1. MY 페이지 접속
2. 프로필 사진 클릭하여 새 이미지 업로드
3. 업로드 완료 후 즉시 새 아바타 표시 확인
4. 페이지 새로고침 없이 변경사항 반영 확인

## 예방 방법

### NextAuth 세션 업데이트가 필요한 경우
1. JWT 콜백에 `trigger` 파라미터 추가
2. `trigger === 'update'` 시 최신 데이터 조회
3. 클라이언트에서 `update()` 함수 호출

### 주의사항
- JWT 토큰 크기 제한 고려 (4KB)
- 민감한 정보는 토큰에 저장하지 않기
- DB 쿼리 최소화 (필요한 필드만 select)

## 참고 자료

- [NextAuth.js JWT Callback](https://next-auth.js.org/configuration/callbacks#jwt-callback)
- [NextAuth.js Session Update](https://next-auth.js.org/getting-started/client#updating-the-session)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)

## 관련 파일

- `/src/lib/auth.ts`: NextAuth 설정 및 JWT 콜백
- `/src/app/my/page.tsx`: 아바타 업로드 UI
- `/src/server/trpc/routers/user.ts`: 아바타 업데이트 API
