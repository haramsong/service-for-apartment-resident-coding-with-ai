# 환경 분리 설정 완료

*작성일: 2025-10-31*

*작성자: Developer Agent*

*이슈 유형: 개발 환경 설정*

*우선순위: High*

## 📋 작업 내용

로컬 개발 환경과 프로덕션 환경을 명확히 분리하여 안전한 개발 및 배포 환경을 구축했습니다.

## 🐛 문제 상황

### 기존 문제점
- 로컬 개발과 프로덕션 환경 변수가 혼재
- 프로덕션 DB로 로컬 개발 시 데이터 오염 위험
- 환경 전환이 명확하지 않음

## 🔍 원인 분석

### 환경 변수 관리 부족
- `.env` 파일이 프로덕션 설정으로 고정
- 로컬 개발용 환경 변수 파일 부재
- 환경 전환 가이드 부족

## ✅ 해결 방법

### 1. 환경 변수 파일 구조화
```
.env                    # Prisma용 (로컬 개발)
.env.local              # Next.js용 (로컬 개발)
.env.prod               # 프로덕션 템플릿
.env.local.example      # 예시 파일
```

### 2. 로컬 개발 환경 설정
```bash
# .env (로컬 개발)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/apartment_community"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=local-dev-secret-key
```

### 3. 프로덕션 환경 설정
```bash
# .env.prod (프로덕션)
DATABASE_URL="postgresql://...@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://...@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres"
NEXTAUTH_URL=https://your-domain.vercel.app
```

### 4. 환경 전환 스크립트
```bash
# 로컬 개발
npm run setup:dev

# 프로덕션
npm run setup:prod
```

## 📊 구현 결과

### 생성된 파일
1. `.env` - 로컬 개발용 (Docker PostgreSQL)
2. `.env.local` - Next.js 런타임용
3. `.env.local.example` - 환경 변수 예시
4. `docs/devops/environment-separation-guide.md` - 가이드 문서

### 환경 분리 확인
- ✅ 로컬: Docker PostgreSQL (localhost:5432)
- ✅ 프로덕션: Supabase PostgreSQL (aws-1-ap-northeast-2)
- ✅ 환경 전환: npm scripts로 간편하게

## 🔄 예방 방법

### 1. 환경 변수 관리 원칙
- 로컬 개발: Docker PostgreSQL 사용
- 프로덕션: Supabase PostgreSQL 사용
- 환경 변수 혼용 절대 금지

### 2. Git 관리
```gitignore
.env
.env.local
.env.prod
```
- 실제 환경 변수는 Git에 커밋하지 않음
- `.env.local.example`만 커밋

### 3. 개발 워크플로우
```bash
# 로컬 개발 시작
npm run setup:dev
docker-compose up -d
npm run db:migrate
npm run dev

# 프로덕션 배포
npm run setup:prod
npm run db:deploy
git push origin main
```

## 📈 다음 단계

1. **팀원 교육**: 환경 분리 가이드 공유
2. **CI/CD 통합**: 자동 환경 전환
3. **모니터링**: 환경별 로그 분리

## 📚 참고 문서
- [환경 분리 가이드](../../devops/environment-separation-guide.md)
- [Vercel 환경 변수 설정](../../devops/vercel-environment-setup.md)
- [PostgreSQL 로컬 환경 구축](../../devops/local-postgres-setup.md)

---

*환경 분리를 통해 안전한 개발과 배포가 가능해졌습니다.*
