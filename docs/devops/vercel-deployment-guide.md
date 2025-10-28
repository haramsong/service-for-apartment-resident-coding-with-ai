# Vercel 배포 가이드

*작성일: 2025-10-28*

*작성자: Developer Agent*

## 개요

아파트 커뮤니티 플랫폼을 Vercel에 배포하는 가이드입니다.

## 사전 요구사항

- Vercel 계정
- GitHub 저장소 연결
- Supabase 프로젝트 (프로덕션 데이터베이스)

## 배포 절차

### 1. Vercel 프로젝트 생성

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. "Add New Project" 클릭
3. GitHub 저장소 선택
4. Framework Preset: Next.js 자동 감지

### 2. 환경 변수 설정

Vercel Dashboard > Settings > Environment Variables에서 다음 환경 변수 추가:

#### 필수 환경 변수

```bash
# Database (Supabase)
DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres

# NextAuth.js
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-production-secret-key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

#### 환경 변수 생성 방법

1. **DATABASE_URL**
   - Supabase Dashboard > Settings > Database > Connection string
   - "Connection Pooling" 모드 사용 (포트 6543)
   - 비밀번호는 프로젝트 생성 시 저장한 값 사용

2. **NEXTAUTH_SECRET**
   ```bash
   openssl rand -base64 32
   ```

3. **NEXT_PUBLIC_SUPABASE_URL & ANON_KEY**
   - Supabase Dashboard > Settings > API
   - Project URL과 anon public key 복사

### 3. 빌드 설정

Vercel은 자동으로 다음 설정을 사용합니다:

```json
{
  "buildCommand": "npm run deploy:prepare",
  "installCommand": "npm install",
  "outputDirectory": ".next"
}
```

### 4. 데이터베이스 마이그레이션

#### 로컬에서 프로덕션 DB에 마이그레이션 적용

```bash
# 프로덕션 환경 변수 설정
npm run setup:prod

# 마이그레이션 실행
npm run db:deploy
```

### 5. 배포 실행

#### 자동 배포 (권장)
- GitHub에 push하면 자동으로 배포됨
- main 브랜치: 프로덕션 배포
- 다른 브랜치: 프리뷰 배포

#### 수동 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포
vercel --prod
```

## 배포 후 확인사항

### 1. 빌드 로그 확인
- Vercel Dashboard > Deployments > 최신 배포 클릭
- Build Logs에서 에러 확인

### 2. 데이터베이스 연결 확인
- 배포된 사이트에서 로그인 시도
- Supabase Dashboard > Database > Logs에서 연결 확인

### 3. 환경 변수 확인
```bash
# Vercel CLI로 확인
vercel env ls
```

## 트러블슈팅

### 빌드 실패

#### Prisma 관련 에러
```bash
Error: @prisma/client did not initialize yet
```

**해결 방법:**
- `postinstall` 스크립트 추가
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

#### 환경 변수 누락
```bash
Error: Missing environment variable
```

**해결 방법:**
- Vercel Dashboard에서 환경 변수 재확인
- 모든 환경(Production, Preview, Development)에 적용되었는지 확인

### 데이터베이스 연결 실패

#### Connection timeout
```bash
Error: Can't reach database server
```

**해결 방법:**
- Supabase Connection Pooling 사용 (포트 6543)
- DATABASE_URL 형식 확인
- Supabase 프로젝트가 활성 상태인지 확인

### 런타임 에러

#### NextAuth 에러
```bash
Error: NEXTAUTH_URL is not set
```

**해결 방법:**
- NEXTAUTH_URL을 실제 배포 도메인으로 설정
- https:// 프로토콜 포함 필수

## 성능 최적화

### 1. Edge Runtime 활용
```typescript
// app/api/route.ts
export const runtime = 'edge'
```

### 2. 이미지 최적화
- Next.js Image 컴포넌트 사용
- Vercel 자동 이미지 최적화 활용

### 3. 캐싱 전략
```typescript
// app/page.tsx
export const revalidate = 60 // 60초마다 재검증
```

## 모니터링

### Vercel Analytics
- Vercel Dashboard > Analytics
- 페이지 로딩 시간, 방문자 수 확인

### Supabase Logs
- Supabase Dashboard > Logs
- 데이터베이스 쿼리 성능 모니터링

## 도메인 설정

### 커스텀 도메인 연결

1. Vercel Dashboard > Settings > Domains
2. 도메인 입력 (예: apartment-community.com)
3. DNS 레코드 추가
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```
4. SSL 인증서 자동 발급 (Let's Encrypt)

## 보안 체크리스트

- [ ] 환경 변수에 민감 정보 저장 (코드에 하드코딩 금지)
- [ ] NEXTAUTH_SECRET 강력한 값 사용
- [ ] Supabase RLS (Row Level Security) 활성화
- [ ] CORS 설정 확인
- [ ] Rate Limiting 설정

## 참고 자료

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Supabase 연동 가이드](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Prisma 배포 가이드](https://www.prisma.io/docs/guides/deployment)

---

*이 가이드를 따라 Vercel에 성공적으로 배포할 수 있습니다.*
