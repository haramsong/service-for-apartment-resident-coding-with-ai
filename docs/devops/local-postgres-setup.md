# PostgreSQL 로컬 환경 세팅 가이드

*작성일: 2025-10-27*

*작성자: Infrastructure Agent*

## 개요

Docker를 사용한 PostgreSQL 로컬 개발 환경 구축 가이드입니다.

## 사전 요구사항

- Docker Desktop 설치
- Docker Compose 설치

## 설치 및 실행

### 1. PostgreSQL 컨테이너 시작

```bash
# 컨테이너 시작
docker-compose up -d

# 로그 확인
docker-compose logs -f postgres

# 상태 확인
docker-compose ps
```

### 2. 환경 변수 설정

```bash
# .env.local 파일 생성
cp .env.local.example .env.local

# DATABASE_URL 확인 (기본값 사용)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/apartment_community"
```

### 3. 데이터베이스 접속 확인

```bash
# psql 클라이언트로 접속
docker exec -it apartment-community-db psql -U postgres -d apartment_community

# 또는 외부 클라이언트 사용
# Host: localhost
# Port: 5432
# Database: apartment_community
# User: postgres
# Password: postgres
```

## 데이터베이스 스키마

### 초기 테이블 생성 (예정)

```sql
-- 아파트 정보
CREATE TABLE apartments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  total_units INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 사용자 정보
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(50) NOT NULL,
  apartment_id UUID REFERENCES apartments(id),
  dong VARCHAR(10),
  ho VARCHAR(10),
  role VARCHAR(20) DEFAULT 'resident',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 유용한 명령어

### 컨테이너 관리

```bash
# 컨테이너 중지
docker-compose stop

# 컨테이너 재시작
docker-compose restart

# 컨테이너 및 볼륨 삭제 (데이터 초기화)
docker-compose down -v

# 컨테이너 로그 확인
docker-compose logs postgres
```

### 데이터베이스 백업 및 복원

```bash
# 백업
docker exec apartment-community-db pg_dump -U postgres apartment_community > backup.sql

# 복원
docker exec -i apartment-community-db psql -U postgres apartment_community < backup.sql
```

## 트러블슈팅

### 포트 충돌

```bash
# 5432 포트가 이미 사용 중인 경우
# docker-compose.yml에서 포트 변경
ports:
  - "5433:5432"  # 호스트:컨테이너

# .env.local의 DATABASE_URL도 변경
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/apartment_community"
```

### 컨테이너 시작 실패

```bash
# 기존 컨테이너 확인 및 제거
docker ps -a | grep apartment-community-db
docker rm -f apartment-community-db

# 볼륨 확인 및 제거
docker volume ls | grep apartment
docker volume rm apartment-community_postgres_data

# 재시작
docker-compose up -d
```

## 보안 주의사항

⚠️ **로컬 개발 환경 전용 설정입니다.**

- 프로덕션 환경에서는 강력한 비밀번호 사용
- 환경 변수를 통한 민감 정보 관리
- `.env.local` 파일은 절대 Git에 커밋하지 않음

## 다음 단계

1. Prisma 또는 Drizzle ORM 설정
2. 데이터베이스 마이그레이션 스크립트 작성
3. 시드 데이터 생성
4. API 연동 테스트

## 참고 자료

- [PostgreSQL 공식 문서](https://www.postgresql.org/docs/)
- [Docker Compose 문서](https://docs.docker.com/compose/)
- [백엔드 아키텍처 설계](../developer/backend-architecture-design.md)
