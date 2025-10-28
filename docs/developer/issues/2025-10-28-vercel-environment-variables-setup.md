# Vercel 환경변수 설정 가이드 작성

*작성일: 2025-10-28*

*작성자: Developer Agent*

*이슈 유형: 배포 환경 설정*

*우선순위: High*

## 📋 문제 상황

Vercel 배포 시 환경변수 설정 방법에 대한 명확한 가이드가 필요했습니다.

### 필요한 환경변수
1. DATABASE_URL (Supabase Connection Pooling)
2. NEXTAUTH_URL (배포 도메인)
3. NEXTAUTH_SECRET (보안 키)
4. NEXT_PUBLIC_SUPABASE_URL
5. NEXT_PUBLIC_SUPABASE_ANON_KEY

## 🔍 원인 분석

### 1. 환경변수 형식 혼란
- 로컬 개발용 DATABASE_URL과 프로덕션용 URL 차이
- Supabase Direct Connection vs Connection Pooling

### 2. 환경별 설정 차이
- Production, Preview, Development 환경별 다른 값 필요
- NEXTAUTH_URL의 환경별 설정 방법

### 3. 보안 고려사항
- 민감한 정보의 안전한 관리
- Git 커밋 방지 필요

## ✅ 해결 방법

### 1. 상세 가이드 문서 작성
`docs/devops/vercel-environment-setup.md` 파일 생성:
- 각 환경변수의 정확한 값과 형식
- 설정 방법 (Dashboard, CLI)
- 주의사항 및 트러블슈팅

### 2. 주요 설정 포인트

#### DATABASE_URL
```
postgresql://postgres.sdvbrpunbzhqypbctfvp:9GqPtioFKcOjjC05@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres
```
- Connection Pooling URL 사용 (포트 6543)
- 직접 연결 URL(포트 5432) 사용 금지

#### NEXTAUTH_URL
- Production: 실제 배포 도메인
- Preview: `https://$VERCEL_URL`
- Development: `http://localhost:3000`

#### NEXTAUTH_SECRET
```bash
# 생성 방법
openssl rand -base64 32
```

### 3. 설정 절차

1. Vercel Dashboard 접속
2. Settings > Environment Variables
3. 각 변수 추가 (Key, Value, Environments 선택)
4. 재배포 실행

## 📊 작성된 문서

### 포함된 내용
1. 필수 환경변수 5개의 상세 설명
2. Vercel Dashboard 설정 방법
3. Vercel CLI 설정 방법
4. 주의사항 및 보안 가이드
5. 트러블슈팅 가이드

### 문서 위치
`/docs/devops/vercel-environment-setup.md`

## 🔄 예방 방법

### 1. 환경변수 템플릿 관리
- `.env.local.example` 파일 최신 상태 유지
- 각 환경별 필요한 변수 명시

### 2. 문서화 강화
- 새로운 환경변수 추가 시 가이드 업데이트
- 변경 이력 관리

### 3. 자동화 검토
- 환경변수 검증 스크립트 작성 고려
- CI/CD 파이프라인에 환경변수 체크 추가

## 📈 다음 단계

1. **실제 배포 테스트**: 가이드대로 설정 후 배포 확인
2. **도메인 설정**: 커스텀 도메인 연결
3. **모니터링 설정**: Vercel Analytics 및 로그 확인

## 📚 참고 문서
- [Vercel 배포 가이드](../devops/vercel-deployment-guide.md)
- [Supabase 배포 설정](./2025-10-28-supabase-deployment-setup.md)

---

*Vercel 환경변수 설정을 위한 완전한 가이드가 작성되었습니다.*
