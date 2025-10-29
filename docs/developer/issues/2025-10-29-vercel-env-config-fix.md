# vercel.json 환경 변수 설정 문제 해결

*작성일: 2025-10-29*

*작성자: Developer Agent*

*이슈 유형: 배포 설정*

*우선순위: High*

## 🐛 문제 상황

### 발견된 문제
vercel.json 파일에서 환경 변수를 잘못된 방식으로 참조하고 있었습니다.

```json
"env": {
  "DATABASE_URL": "@database-url",
  "NEXTAUTH_URL": "@nextauth-url",
  ...
}
```

### 문제점
- `@` 접두사는 Vercel의 시크릿 참조 방식이지만, 일반 환경 변수에는 사용하지 않음
- 이 방식은 Vercel CLI로 생성한 시크릿을 참조할 때만 사용
- 일반 환경 변수는 Vercel Dashboard에서 직접 설정해야 함

## 🔍 원인 분석

### Vercel 환경 변수 설정 방식
1. **Dashboard 설정**: Vercel Dashboard > Settings > Environment Variables에서 직접 설정
2. **vercel.json**: 빌드 설정만 포함, 환경 변수는 Dashboard에서 관리
3. **시크릿 참조**: `@secret-name` 형식은 `vercel secrets` 명령어로 생성한 시크릿 전용

## ✅ 해결 방법

### 1. vercel.json 수정
환경 변수 섹션을 제거하고 빌드 설정만 유지:

```json
{
  "buildCommand": "npm run deploy:prepare",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["icn1"]
}
```

### 2. 환경 변수 설정 방법
Vercel Dashboard에서 직접 설정:

1. Vercel Dashboard 접속
2. 프로젝트 선택
3. Settings > Environment Variables
4. 각 환경 변수 추가:
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🔄 예방 방법

### 1. 올바른 환경 변수 관리
- **vercel.json**: 빌드 설정, 리전, 리다이렉트 등만 포함
- **Dashboard**: 모든 환경 변수는 Dashboard에서 관리
- **시크릿**: 민감한 정보는 `vercel secrets` 명령어로 생성 후 참조

### 2. 문서 참조
- [Vercel 환경 변수 가이드](../devops/vercel-environment-setup.md)
- [Vercel 공식 문서](https://vercel.com/docs/concepts/projects/environment-variables)

### 3. 체크리스트
- [ ] vercel.json에 환경 변수 직접 포함하지 않기
- [ ] Dashboard에서 모든 환경 변수 설정
- [ ] 배포 전 환경 변수 확인

## 📚 참고 문서
- [Vercel 배포 가이드](../devops/vercel-deployment-guide.md)
- [환경 변수 설정 가이드](../devops/vercel-environment-setup.md)

---

*vercel.json 설정이 올바르게 수정되었습니다. 환경 변수는 Vercel Dashboard에서 설정하세요.*
