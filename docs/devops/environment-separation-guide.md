# 환경 분리 가이드

*작성일: 2025-10-31*

*작성자: Developer Agent*

## 📋 환경 구성

### 1. 로컬 개발 환경
- **데이터베이스**: PostgreSQL (Docker)
- **포트**: localhost:5432
- **NextAuth URL**: http://localhost:3000

### 2. 프로덕션 환경
- **데이터베이스**: Supabase PostgreSQL
- **포트**: 5432 (Direct), 6543 (Pooling)
- **NextAuth URL**: Vercel 배포 도메인

## 🔧 환경 전환 방법

### 로컬 개발 환경으로 전환
```bash
npm run setup:dev
```

이 명령어는:
- `.env.local.example`을 `.env.local`로 복사 (없는 경우)
- 로컬 PostgreSQL 연결 설정

### 프로덕션 환경으로 전환
```bash
npm run setup:prod
```

이 명령어는:
- `.env.prod`를 `.env`로 복사
- Supabase 프로덕션 DB 연결 설정

## 📁 환경 변수 파일 구조

```
.env                    # Prisma가 읽는 파일 (로컬 개발용)
.env.local              # Next.js가 읽는 파일 (로컬 개발용)
.env.prod               # 프로덕션 환경 변수 템플릿
.env.local.example      # 환경 변수 예시 파일
```

## 🔐 환경 변수 설명

### DATABASE_URL
- **로컬**: `postgresql://postgres:postgres@localhost:5432/apartment_community`
- **프로덕션**: Supabase Connection Pooling URL (포트 6543)

### DIRECT_URL (프로덕션만)
- Prisma 마이그레이션용 Direct Connection (포트 5432)

### NEXTAUTH_URL
- **로컬**: `http://localhost:3000`
- **프로덕션**: Vercel 배포 도메인

### NEXTAUTH_SECRET
- **로컬**: 개발용 시크릿 키
- **프로덕션**: 강력한 랜덤 키 (`openssl rand -base64 32`)

## ⚠️ 주의사항

### 1. Git 관리
```gitignore
.env
.env.local
.env.prod
```
- 실제 환경 변수 파일은 Git에 커밋하지 않음
- `.env.local.example`만 커밋

### 2. 환경 분리 원칙
- 로컬 개발: Docker PostgreSQL 사용
- 프로덕션: Supabase PostgreSQL 사용
- 환경 변수 혼용 금지

### 3. 데이터베이스 마이그레이션
```bash
# 로컬 개발
npm run setup:dev
npm run db:migrate

# 프로덕션
npm run setup:prod
npm run db:deploy
```

## 🔄 일반적인 워크플로우

### 로컬 개발 시작
```bash
# 1. 환경 설정
npm run setup:dev

# 2. Docker 시작
docker-compose up -d

# 3. 마이그레이션
npm run db:migrate

# 4. 개발 서버 시작
npm run dev
```

### 프로덕션 배포
```bash
# 1. 프로덕션 환경 설정
npm run setup:prod

# 2. 마이그레이션 (로컬에서 실행)
npm run db:deploy

# 3. Vercel 배포
git push origin main
```

## 📚 참고 문서
- [Vercel 환경 변수 설정](./vercel-environment-setup.md)
- [Supabase 배포 설정](../developer/issues/2025-10-28-supabase-deployment-setup.md)
- [PostgreSQL 로컬 환경 구축](./local-postgres-setup.md)

---

*환경 분리를 통해 로컬 개발과 프로덕션 배포를 안전하게 관리할 수 있습니다.*
