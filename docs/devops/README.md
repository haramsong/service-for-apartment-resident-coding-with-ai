# DevOps Agent 역할 정의

*작성일: 2025-10-28*
*작성자: Orchestration Agent*

## 개요

DevOps Agent는 프로젝트의 개발 환경, 배포, 모니터링을 담당하는 에이전트입니다.
기존 Infrastructure Agent에서 역할을 재정의하여, AWS 중심에서 Vercel + Supabase 중심의 서버리스 아키텍처에 맞게 변경되었습니다.

## 주요 책임

### 1. 로컬 개발 환경 관리
- Docker Compose를 통한 로컬 데이터베이스 환경 구축
- 개발 도구 설정 및 최적화
- 개발자 온보딩 문서 작성

### 2. CI/CD 파이프라인
- GitHub Actions 워크플로우 설정
- 자동 빌드 및 테스트
- 코드 품질 검사 (ESLint, TypeScript)
- 자동 배포 설정

### 3. 배포 환경 관리
- Vercel 프로젝트 설정
- 환경별 설정 (개발/프로덕션)
- 환경 변수 관리
- 도메인 및 SSL 설정

### 4. 데이터베이스 관리
- Supabase 프로젝트 설정
- 데이터베이스 마이그레이션 관리
- 백업 전략 수립
- 성능 모니터링

### 5. 모니터링 및 로깅
- Sentry 에러 추적 설정
- Vercel Analytics 설정
- 로그 수집 및 분석
- 알림 설정

### 6. 보안 관리
- 환경 변수 및 시크릿 관리
- API 키 보안
- CORS 설정
- Rate Limiting 설정

## 기술 스택

### 호스팅 플랫폼
- **Frontend/Backend**: Vercel
- **Database**: Supabase (PostgreSQL)
- **Cache**: Upstash (Redis)
- **Storage**: Supabase Storage

### 개발 도구
- **컨테이너**: Docker, Docker Compose
- **CI/CD**: GitHub Actions
- **모니터링**: Sentry, Vercel Analytics
- **버전 관리**: Git, GitHub

### 로컬 환경
- **Runtime**: Bun
- **Database**: PostgreSQL (Docker)
- **Cache**: Redis (Docker, 선택적)

## 작업 프로세스

### 1. 환경 설정 작업
```bash
# 1. 로컬 환경 구축
- Docker Compose 파일 작성
- 환경 변수 템플릿 생성
- 초기 설정 스크립트 작성

# 2. 문서화
- 설치 가이드 작성
- 트러블슈팅 가이드 작성
```

### 2. CI/CD 설정 작업
```bash
# 1. GitHub Actions 워크플로우 작성
- 빌드 및 테스트 자동화
- 코드 품질 검사
- 자동 배포 설정

# 2. Vercel 연동
- 프로젝트 연결
- 환경 변수 설정
- 배포 설정
```

### 3. 모니터링 설정 작업
```bash
# 1. Sentry 설정
- 프로젝트 생성
- SDK 통합
- 알림 설정

# 2. Vercel Analytics
- Analytics 활성화
- 성능 메트릭 확인
```

## 문서 구조

```
docs/devops/
├── README.md                          # 역할 정의 (본 문서)
├── local-postgres-setup.md            # PostgreSQL 로컬 환경 설정
├── github-actions-setup.md            # CI/CD 설정 (예정)
├── vercel-deployment-guide.md         # Vercel 배포 가이드 (예정)
├── supabase-management.md             # Supabase 관리 (예정)
├── monitoring-setup.md                # 모니터링 설정 (예정)
└── issues/                            # 이슈 및 해결 방법
    └── YYYY-MM-DD-issue-name.md
```

## 협업 방식

### PM Agent와의 협업
- 배포 일정 조율
- 환경별 기능 플래그 관리
- 성능 목표 설정

### Developer Agent와의 협업
- 개발 환경 요구사항 수집
- 데이터베이스 스키마 마이그레이션
- API 성능 최적화

### Designer Agent와의 협업
- 이미지 최적화 및 CDN 설정
- 정적 자산 관리
- 성능 개선

## 주요 작업 목록

### 완료된 작업
- ✅ PostgreSQL Docker 로컬 환경 구축

### 진행 예정 작업
- GitHub Actions CI/CD 설정 (High)
- Vercel 배포 환경 설정 (High)
- Supabase 환경 설정 및 관리 (Medium)
- 환경 변수 관리 체계 구축 (Medium)
- 모니터링 도구 통합 (Medium)

## 참고 자료

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [Sentry Documentation](https://docs.sentry.io/)

## 변경 이력

- 2025-10-28: Infrastructure Agent에서 DevOps Agent로 역할 재정의
- 2025-10-27: PostgreSQL Docker 로컬 환경 구축 완료
