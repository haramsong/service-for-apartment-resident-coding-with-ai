# NextAuth → Supabase Auth 전환

_작성일: 2025-11-06_

_작성자: Developer Agent_

## 문제 상황

기존 NextAuth.js 기반 인증 시스템을 Supabase Auth로 전환 요청

## 전환 이유

1. **통합 관리**: Supabase를 이미 데이터베이스와 Storage로 사용 중이므로 인증도 통합
2. **간소화**: NextAuth 설정 및 유지보수 복잡도 감소
3. **기능 확장**: Supabase Auth의 소셜 로그인, 이메일 인증 등 기능 활용 가능
4. **비용 절감**: 별도 인증 서버 불필요

## 해결 방법

### 1. 패키지 변경

**제거:**
- `next-auth`
- `@auth/prisma-adapter`
- `bcryptjs`

**추가:**
- `@supabase/ssr`
- `@supabase/auth-helpers-nextjs`

### 2. 파일 구조 변경

**생성:**
- `src/lib/supabase/client.ts` - 브라우저 클라이언트
- `src/lib/supabase/server.ts` - 서버 클라이언트
- `src/lib/supabase/middleware.ts` - 미들웨어 클라이언트

**제거:**
- `src/lib/auth.ts` - NextAuth 설정
- `src/lib/auth-utils.ts` - 비밀번호 해싱 유틸
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth API 라우트
- `src/components/providers/session-provider.tsx`
- `src/components/providers/auth-provider.tsx`

### 3. 코드 변경

#### tRPC Context (src/server/trpc/trpc.ts)

**Before:**
```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const createTRPCContext = async (opts: FetchCreateContextFnOptions) => {
  const session = await getServerSession(authOptions)
  return {
    req: opts.req,
    session,
    user: session?.user,
  }
}
```

**After:**
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createTRPCContext = async (opts: FetchCreateContextFnOptions) => {
  const cookieStore = await cookies()
  const supabase = createServerClient(...)
  const { data: { user: supabaseUser } } = await supabase.auth.getUser()
  
  let user = null
  if (supabaseUser) {
    user = await prisma.user.findUnique({ where: { id: supabaseUser.id } })
  }
  
  return { req: opts.req, supabase, user }
}
```

#### 로그인 (src/app/auth/signin/page.tsx)

**Before:**
```typescript
import { signIn } from 'next-auth/react'

const result = await signIn('credentials', {
  email,
  password,
  redirect: false,
})
```

**After:**
```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { error } = await supabase.auth.signInWithPassword({
  email,
  password,
})
```

#### 회원가입 (src/server/trpc/routers/auth.ts)

**Before:**
```typescript
const hashedPassword = await hashPassword(input.password)
const user = await prisma.user.create({
  data: {
    email: input.email,
    password: hashedPassword,
    ...
  }
})
```

**After:**
```typescript
const { data: authData, error } = await ctx.supabase.auth.signUp({
  email: input.email,
  password: input.password,
})

const user = await prisma.user.create({
  data: {
    id: authData.user.id,
    email: input.email,
    password: "", // Supabase Auth 사용으로 불필요
    ...
  }
})
```

#### 로그아웃 (src/app/my/page.tsx)

**Before:**
```typescript
import { signOut } from 'next-auth/react'

await signOut({ callbackUrl: '/auth/signin' })
```

**After:**
```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
await supabase.auth.signOut()
router.push('/auth/signin')
router.refresh()
```

#### 미들웨어 (src/middleware.ts)

**Before:**
```typescript
import { withAuth } from "next-auth/middleware"

export default withAuth(...)
```

**After:**
```typescript
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: any) {
  return await updateSession(request)
}
```

## 주의사항

### 1. 사용자 ID 관리

- Supabase Auth의 사용자 ID를 Prisma User 테이블의 ID로 사용
- 회원가입 시 Supabase Auth 먼저 생성 후 Prisma에 동일 ID로 저장

### 2. 비밀번호 필드

- Prisma User 모델의 `password` 필드는 빈 문자열로 저장
- 실제 비밀번호는 Supabase Auth에서 관리

### 3. 세션 관리

- 쿠키 기반 세션 자동 관리
- 미들웨어에서 자동으로 세션 갱신

### 4. 환경 변수

필수 환경 변수:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 예방 방법

### 1. 초기 설계 시 인증 시스템 통합 고려

프로젝트 초기에 사용할 서비스(Supabase, Firebase 등)를 결정하고 인증도 해당 서비스로 통합

### 2. 인증 추상화 레이어

인증 로직을 추상화하여 향후 전환 시 영향 범위 최소화

### 3. 문서화

인증 시스템 변경 시 영향받는 모든 파일과 코드 목록 작성

## 테스트 체크리스트

- [ ] 회원가입 정상 작동
- [ ] 로그인 정상 작동
- [ ] 로그아웃 정상 작동
- [ ] 인증 필요 페이지 접근 제어
- [ ] tRPC 인증 미들웨어 작동
- [ ] 프로필 조회 정상 작동
- [ ] 아바타 업로드 정상 작동

## 참고 자료

- [Supabase Auth 공식 문서](https://supabase.com/docs/guides/auth)
- [Supabase SSR 가이드](https://supabase.com/docs/guides/auth/server-side/nextjs)
