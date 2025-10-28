# Supabase 배포 환경 설정 완료

*작성일: 2025-10-28*

*작성자: Developer Agent*

*이슈 유형: 배포 환경 설정*

*우선순위: High*

## 📋 작업 내용

Supabase 데이터베이스를 사용한 프로덕션 배포 환경을 설정했습니다.

## 🔧 구성된 파일

### 1. 환경 변수 파일
- `.env.prod` - 프로덕션 환경 변수
- `.env.local.example` - 환경 변수 템플릿 업데이트
- `scripts/setup-env.sh` - 환경 설정 자동화 스크립트

### 2. 배포 설정
- `vercel.json` - Vercel 배포 설정
- `package.json` - 배포 관련 스크립트 추가

## 🎯 주요 설정

### Supabase 연결 정보
```bash
# 프로덕션 DATABASE_URL
DATABASE_URL="postgresql://postgres.sdvbrpunbzhqypbctfvp:9GqPtioFKcOjjC05@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres"

# Supabase 프로젝트 정보
NEXT_PUBLIC_SUPABASE_URL=https://sdvbrpunbzhqypbctfvp.supabase.co
```

### 배포 스크립트
- `npm run setup:prod` - 프로덕션 환경 변수 설정
- `npm run deploy:prepare` - 배포 준비 (환경설정 + 빌드)
- `npm run db:deploy` - 프로덕션 DB 마이그레이션

## 🚀 배포 절차

### 1. Vercel 환경 변수 설정
```bash
# Vercel 대시보드에서 다음 환경 변수 설정:
DATABASE_URL=postgresql://postgres.sdvbrpunbzhqypbctfvp:9GqPtioFKcOjjC05@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://sdvbrpunbzhqypbctfvp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkdmJycHVuYnpocXlwYmN0ZnZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MzUyNjksImV4cCI6MjA3NzIxMTI2OX0.0T4Ay78nZ0dztTmd6-9nqLzSsmE7aJgW_LzeZsuXnR8
```

### 2. 데이터베이스 마이그레이션
```bash
# 로컬에서 프로덕션 DB에 스키마 적용
npm run setup:prod
npm run db:deploy
```

### 3. Vercel 배포
```bash
# Vercel CLI 사용
vercel --prod

# 또는 GitHub 연동으로 자동 배포
```

## 🔄 로컬 개발 vs 프로덕션

### 로컬 개발
- PostgreSQL Docker 컨테이너 사용
- `npm run setup:dev` 실행

### 프로덕션
- Supabase PostgreSQL 사용
- `npm run setup:prod` 실행

## ⚠️ 주의사항

### 1. 보안
- `.env.prod` 파일은 Git에 커밋하지 않음
- 프로덕션 시크릿은 Vercel 환경 변수에서만 관리

### 2. 데이터베이스
- 프로덕션 DB 작업 시 백업 필수
- 마이그레이션 전 스키마 검증

### 3. 환경 분리
- 로컬/프로덕션 환경 변수 혼용 금지
- 배포 전 환경 설정 스크립트 실행

## 📚 참고 문서
- [Supabase 공식 문서](https://supabase.com/docs)
- [Vercel 배포 가이드](https://vercel.com/docs)
- [Prisma 배포 가이드](https://www.prisma.io/docs/guides/deployment)

---

*Supabase를 사용한 프로덕션 배포 환경이 완전히 구성되었습니다.*
