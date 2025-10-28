# Prisma 데이터베이스 연결 오류 해결

*작성일: 2025-10-28*

*작성자: Developer Agent*

*이슈 유형: 데이터베이스 연결*

*우선순위: High*

## 🐛 문제 상황

### 발생한 에러
```
PrismaConfigEnvError: Missing required environment variable: DATABASE_URL
```

### 문제점
1. **잘못된 DATABASE_URL 형식**: `.env`와 `.env.local` 파일에 Prisma Accelerate 형식의 URL이 설정됨
2. **prisma.config.ts 충돌**: 불필요한 설정 파일로 인한 환경 변수 로딩 문제
3. **로컬 PostgreSQL 연결 실패**: Docker 컨테이너는 정상 작동하지만 Prisma가 연결하지 못함

## 🔍 원인 분석

### 1. 잘못된 DATABASE_URL
```bash
# 문제가 있던 URL (Prisma Accelerate 형식)
DATABASE_URL="prisma+postgres://localhost:51213/?api_key=..."

# 올바른 URL (로컬 PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/apartment_community"
```

### 2. prisma.config.ts 파일 문제
- Prisma v6에서 `prisma.config.ts`는 선택적 설정 파일
- 환경 변수 로딩에 간섭을 일으킴
- 기본 설정으로도 충분함

## ✅ 해결 방법

### 1. DATABASE_URL 수정
```bash
# .env 파일 수정
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/apartment_community"

# .env.local 파일 수정
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/apartment_community"
```

### 2. prisma.config.ts 파일 제거
```bash
rm prisma.config.ts
```

### 3. Prisma Client 재생성
```bash
bun run prisma generate
bun run prisma db push
```

## 📊 해결 결과

### 성공적인 연결 확인
```
✔ Generated Prisma Client (v6.18.0) to ./node_modules/@prisma/client in 173ms
The database is already in sync with the Prisma schema.
```

### 테스트 완료
- ✅ `prisma db pull` 성공
- ✅ `prisma generate` 성공  
- ✅ `prisma db push` 성공
- ✅ Docker PostgreSQL 컨테이너 정상 작동

## 🔄 예방 방법

### 1. 환경 변수 관리
- `.env.example` 파일에 올바른 형식 명시
- 로컬/개발/프로덕션 환경별 URL 구분
- 민감 정보는 `.env.local`에만 저장

### 2. Prisma 설정 단순화
- 기본 설정 사용 권장
- `prisma.config.ts`는 복잡한 설정이 필요할 때만 사용
- 환경 변수 로딩 문제 방지

### 3. 연결 테스트 자동화
```bash
# package.json에 스크립트 추가
"scripts": {
  "db:test": "prisma db pull",
  "db:reset": "prisma migrate reset",
  "db:seed": "bun run prisma/seed.ts"
}
```

## 📚 참고 문서
- [Prisma 환경 변수 설정](https://www.prisma.io/docs/guides/development-environment/environment-variables)
- [PostgreSQL 로컬 환경 구축](../../devops/local-postgres-setup.md)
- [데이터베이스 스키마 설정](./2025-10-27-database-schema-setup.md)

## 🎯 다음 단계

1. **시드 데이터 실행**: `bun run db:seed`
2. **API 연동 테스트**: tRPC 라우터에서 Prisma 사용
3. **프론트엔드 연동**: 실제 데이터로 UI 테스트

---

*이제 Prisma가 정상적으로 로컬 PostgreSQL에 연결되어 개발을 진행할 수 있습니다.*
