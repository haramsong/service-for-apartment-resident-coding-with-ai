# 데이터베이스 스키마 적용 완료

*작성일: 2025-10-27*

*작성자: Developer Agent*

*이슈 유형: 인프라 구축*

*우선순위: High*

## 📋 작업 내용

백엔드 아키텍처 설계 문서를 기반으로 PostgreSQL 데이터베이스 스키마를 Prisma ORM을 사용하여 구축했습니다.

## 🔧 구현 사항

### 1. Prisma 설치 및 설정
```bash
bun add -D prisma
bun add @prisma/client
bunx prisma init
```

### 2. 데이터베이스 스키마 정의
다음 모델들을 정의했습니다:
- **Apartment**: 아파트 정보
- **User**: 사용자 정보 (입주민, 관리자)
- **Notice**: 공지사항
- **Post**: 게시글
- **Comment**: 댓글
- **Complaint**: 민원
- **Facility**: 시설 (헬스장, 독서실, 회의실)
- **Reservation**: 시설 예약
- **ManagementFee**: 관리비

### 3. 마이그레이션 실행
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/apartment_community" \
  bunx prisma migrate dev --name init
```

### 4. Prisma 클라이언트 생성
- `src/lib/prisma.ts`: 싱글톤 패턴으로 Prisma 클라이언트 생성
- 개발 환경에서 Hot Reload 대응

### 5. 시드 데이터 생성
`prisma/seed.ts`에 초기 데이터 생성 스크립트 작성:
- 아파트 1개
- 관리자 1명
- 입주민 1명
- 공지사항 1개
- 시설 3개 (헬스장, 독서실, 회의실)
- 게시글 1개

## 📊 데이터베이스 구조

### 주요 관계
```
Apartment (1) ─── (N) User
Apartment (1) ─── (N) Notice
Apartment (1) ─── (N) Post
Apartment (1) ─── (N) Facility
User (1) ─── (N) Post
User (1) ─── (N) Comment
Post (1) ─── (N) Comment
Facility (1) ─── (N) Reservation
```

### 인덱스 및 제약조건
- 모든 ID는 UUID 사용
- User.email은 UNIQUE
- Reservation은 (facilityId, date, startTime) 복합 UNIQUE
- Comment는 Post 삭제 시 CASCADE 삭제

## 🚀 사용 방법

### 개발 환경에서 사용
```typescript
import { prisma } from '@/lib/prisma'

// 사용자 조회
const users = await prisma.user.findMany()

// 공지사항 생성
const notice = await prisma.notice.create({
  data: {
    apartmentId: 'xxx',
    authorId: 'yyy',
    title: '공지사항 제목',
    content: '내용',
  }
})
```

### 유용한 명령어
```bash
# Prisma 클라이언트 재생성
bun run db:generate

# 마이그레이션 실행
bun run db:migrate

# 시드 데이터 실행
bun run db:seed

# Prisma Studio (GUI) 실행
bun run db:studio
```

## ✅ 검증 결과

### 마이그레이션 성공
```
✔ Generated Prisma Client (v6.18.0)
Applying migration `20251027075540_init`
Your database is now in sync with your schema.
```

### 시드 데이터 생성 성공
```
✅ 아파트 생성: 우리아파트
✅ 관리자 생성: 관리사무소
✅ 입주민 생성: 홍길동
✅ 공지사항 생성: 엘리베이터 점검 안내
✅ 시설 생성: 3 개
✅ 게시글 생성: 아이 놀이터 이용 시간 문의
🎉 시드 데이터 생성 완료!
```

## 🔄 예방 방법

### 1. 마이그레이션 관리
- 스키마 변경 시 항상 마이그레이션 생성
- 프로덕션 배포 전 마이그레이션 테스트
- 롤백 계획 수립

### 2. 데이터 무결성
- 외래 키 제약조건 활용
- 필수 필드는 NOT NULL 설정
- 적절한 인덱스 설정

### 3. 성능 최적화
- N+1 쿼리 방지 (include, select 활용)
- 페이지네이션 구현
- 적절한 인덱스 추가

## 📚 참고 문서
- [백엔드 아키텍처 설계](../backend-architecture-design.md)
- [Prisma 공식 문서](https://www.prisma.io/docs)
- [PostgreSQL 로컬 환경 구축](../../infrastructure/local-postgres-setup.md)

## 🎯 다음 단계

1. **tRPC 라우터 구현**: API 엔드포인트 생성
2. **인증 시스템**: NextAuth.js 연동
3. **API 테스트**: 각 모델별 CRUD 테스트
4. **프론트엔드 연동**: 실제 데이터로 UI 연결

---

*이제 데이터베이스 기반이 완성되어 본격적인 API 개발을 시작할 수 있습니다.*
