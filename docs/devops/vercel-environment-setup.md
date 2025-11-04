# Vercel 환경변수 설정 가이드

_작성일: 2025-10-28_

_작성자: Developer Agent_

## 📋 필수 환경변수

Vercel Dashboard > Settings > Environment Variables에서 다음 환경변수를 설정해야 합니다.

### 1. 데이터베이스 (DATABASE_URL)

**변수명**: `DATABASE_URL`

**값**:

```
postgresql://postgres.sdvbrpunbzhqypbctfvp:9GqPtioFKcOjjC05@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres
```

**적용 환경**: Production, Preview, Development 모두 체크

**중요**:

- Supabase Connection Pooling URL 사용 (포트 6543)
- 직접 연결 URL(포트 5432)이 아닌 Pooling URL 사용 필수

### 2. NextAuth URL (NEXTAUTH_URL)

**변수명**: `NEXTAUTH_URL`

**값**:

- Production: `https://your-domain.vercel.app` (실제 배포 도메인으로 변경)
- Preview: `https://$VERCEL_URL` (자동 설정)
- Development: `http://localhost:2555`

**적용 환경**: 각 환경별로 다르게 설정

### 3. NextAuth Secret (NEXTAUTH_SECRET)

**변수명**: `NEXTAUTH_SECRET`

**값**:

```
RGQaDON/NZ0ahBgLdYnNnrWopt/pV4/yC0I7mJPrSnE=
```

**적용 환경**: Production, Preview, Development 모두 체크

**생성 방법**:

```bash
openssl rand -base64 32
```

### 4. Supabase URL (NEXT_PUBLIC_SUPABASE_URL)

**변수명**: `NEXT_PUBLIC_SUPABASE_URL`

**값**:

```
https://sdvbrpunbzhqypbctfvp.supabase.co
```

**적용 환경**: Production, Preview, Development 모두 체크

**주의**: `NEXT_PUBLIC_` 접두사는 클라이언트에서 접근 가능

### 5. Supabase Anon Key (NEXT_PUBLIC_SUPABASE_ANON_KEY)

**변수명**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**값**:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkdmJycHVuYnpocXlwYmN0ZnZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MzUyNjksImV4cCI6MjA3NzIxMTI2OX0.0T4Ay78nZ0dztTmd6-9nqLzSsmE7aJgW_LzeZsuXnR8
```

**적용 환경**: Production, Preview, Development 모두 체크

## 🔧 설정 방법

### Vercel Dashboard에서 설정

1. Vercel 프로젝트 페이지 접속
2. Settings 탭 클릭
3. Environment Variables 메뉴 선택
4. 각 환경변수 추가:
   - Key: 변수명 입력
   - Value: 값 입력
   - Environments: 적용할 환경 선택 (Production, Preview, Development)
   - Add 버튼 클릭

### Vercel CLI로 설정

```bash
# Production 환경
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Preview 환경
vercel env add DATABASE_URL preview
# ... 나머지 변수들도 동일하게

# Development 환경
vercel env add DATABASE_URL development
# ... 나머지 변수들도 동일하게
```

## ⚠️ 주의사항

### 1. DATABASE_URL 형식

- ❌ 잘못된 형식: `postgresql://postgres:password@db.xxx.supabase.co:5432/postgres`
- ✅ 올바른 형식: `postgresql://postgres.xxx:password@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres`

### 2. NEXTAUTH_URL 설정

- Production: 실제 배포 도메인 사용
- Preview: `https://$VERCEL_URL` 사용 (Vercel 자동 변수)
- Development: `http://localhost:2555`

### 3. 환경변수 적용

- 환경변수 변경 후 **재배포 필요**
- Vercel Dashboard에서 Redeploy 버튼 클릭

### 4. 보안

- `.env.prod` 파일은 Git에 커밋하지 않음
- 환경변수는 Vercel Dashboard에서만 관리
- NEXTAUTH_SECRET은 절대 공개하지 않음

## 🔍 문제 해결

### 환경변수가 적용되지 않을 때

1. **재배포 확인**

   ```bash
   vercel --prod
   ```

2. **환경변수 확인**

   ```bash
   vercel env ls
   ```

3. **빌드 로그 확인**
   - Vercel Dashboard > Deployments > 최신 배포 클릭
   - Build Logs 확인

### DATABASE_URL 연결 오류

**증상**: `Can't reach database server`

**해결**:

- Supabase Connection Pooling URL 사용 확인 (포트 6543)
- Supabase 프로젝트가 활성 상태인지 확인
- DATABASE_URL 형식 재확인

### NEXTAUTH_URL 오류

**증상**: `NEXTAUTH_URL is not set`

**해결**:

- Production 환경에 실제 도메인 설정
- Preview 환경에 `https://$VERCEL_URL` 설정
- 재배포 후 확인

## 📚 참고 문서

- [Vercel 환경변수 문서](https://vercel.com/docs/concepts/projects/environment-variables)
- [NextAuth.js 배포 가이드](https://next-auth.js.org/deployment)
- [Supabase 연결 가이드](https://supabase.com/docs/guides/database/connecting-to-postgres)

---

_이 가이드를 따라 Vercel 환경변수를 올바르게 설정하면 배포가 성공적으로 완료됩니다._
