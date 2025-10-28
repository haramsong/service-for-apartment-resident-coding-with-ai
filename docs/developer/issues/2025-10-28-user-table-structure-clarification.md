# User 테이블 구조 명확화 - user_id 필드 필요성 검토

*작성일: 2025-10-28*

*작성자: Developer Agent*

*이슈 유형: 데이터베이스 설계 검토*

*우선순위: Medium*

## 📋 문의 내용

User 테이블 구조에서 `user_id` 필드의 필요성에 대한 문의가 있었습니다.

## 🔍 현재 User 테이블 구조 분석

### Prisma 스키마 확인
```prisma
model User {
  id          String   @id @default(uuid())  // 기본 키
  email       String   @unique @db.VarChar(255)
  password    String   @default("temp_password") @db.VarChar(255)
  name        String   @db.VarChar(50)
  apartmentId String?  @map("apartment_id")
  dong        String?  @db.VarChar(10)
  ho          String?  @db.VarChar(10)
  role        String   @default("resident") @db.VarChar(20)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  // 관계 설정
  apartment      Apartment?      @relation(fields: [apartmentId], references: [id])
  notices        Notice[]
  posts          Post[]
  comments       Comment[]
  complaints     Complaint[]
  reservations   Reservation[]
  managementFees ManagementFee[]
}
```

## ✅ 결론: user_id 필드 불필요

### 1. 기본 키 역할 수행
- `id` 필드가 이미 **Primary Key** 역할
- UUID 타입으로 고유성 보장
- 자동 생성되는 고유 식별자

### 2. 관계 참조 확인
모든 다른 테이블에서 User를 참조할 때 `id` 필드 사용:

```prisma
// 공지사항 테이블
model Notice {
  authorId String @map("author_id")
  author   User   @relation(fields: [authorId], references: [id])
}

// 게시글 테이블
model Post {
  authorId String @map("author_id")
  author   User   @relation(fields: [authorId], references: [id])
}

// 민원 테이블
model Complaint {
  userId String @map("user_id")
  user   User   @relation(fields: [userId], references: [id])
}
```

### 3. 데이터베이스 테이블 매핑
```sql
-- PostgreSQL 실제 테이블 구조
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- 사용자 식별자
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) DEFAULT 'temp_password',
  name VARCHAR(50) NOT NULL,
  apartment_id UUID,
  dong VARCHAR(10),
  ho VARCHAR(10),
  role VARCHAR(20) DEFAULT 'resident',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🚫 user_id 필드 추가 시 문제점

### 1. 중복성
- `id`와 `user_id`가 동일한 역할 수행
- 불필요한 데이터 중복

### 2. 혼란 야기
- 어떤 필드를 사용해야 할지 혼란
- 개발자 간 일관성 부족

### 3. 성능 저하
- 추가 인덱스 필요
- 불필요한 저장 공간 사용

## 📚 참고 문서
- [백엔드 아키텍처 설계](../backend-architecture-design.md)
- [데이터베이스 스키마 설정](./2025-10-27-database-schema-setup.md)
- [Prisma 스키마](../../prisma/schema.prisma)

## 💡 권장사항

현재 스키마 구조를 그대로 유지하고, `User.id` 필드를 사용자 식별자로 계속 사용하는 것을 권장합니다.

---

*User 테이블 구조는 현재 상태가 최적이며, 추가적인 user_id 필드는 불필요합니다.*
