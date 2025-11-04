# 백엔드 아키텍처 설계

_작성일: 2025-10-27_

_작성자: Developer Agent_

_버전: v1.0_

## 1. 아키텍처 개요

### 설계 원칙

- **서버리스 우선**: 확장성과 비용 효율성
- **마이크로서비스**: 기능별 독립적 배포
- **타입 안전성**: End-to-End TypeScript
- **실시간 지원**: WebSocket 기반 알림

### 기술 스택

```typescript
// Backend Core
- Runtime: Node.js 20 (TypeScript)
- Framework: Next.js 15 API Routes + tRPC v11
- Database: PostgreSQL (Supabase)
- Cache: Redis (Upstash)
- Real-time: Supabase Realtime
- Auth: Supabase Auth + NextAuth.js v5
```

## 2. 시스템 아키텍처

### 2.1 레이어 구조

```
┌─────────────────────────────────────┐
│   Client (Next.js 15 + React)       │
├─────────────────────────────────────┤
│   API Gateway (tRPC)                │
├─────────────────────────────────────┤
│   Business Logic Layer              │
│   ├─ Auth Service                   │
│   ├─ Community Service              │
│   ├─ Management Service             │
│   └─ Notification Service           │
├─────────────────────────────────────┤
│   Data Access Layer                 │
│   ├─ Supabase Client                │
│   ├─ Redis Client                   │
│   └─ File Storage                   │
├─────────────────────────────────────┤
│   Infrastructure                    │
│   ├─ PostgreSQL (Supabase)          │
│   ├─ Redis (Upstash)                │
│   └─ S3 (Supabase Storage)          │
└─────────────────────────────────────┘
```

### 2.2 서비스 분리

```typescript
// 서비스별 책임 분리
services/
├── auth/           // 인증/인가
├── community/      // 게시판, 댓글
├── management/     // 관리비, 민원
├── facility/       // 시설 예약
├── notification/   // 알림
└── user/          // 사용자 관리
```

## 3. API 설계 (tRPC)

### 3.1 라우터 구조

```typescript
// server/trpc/router.ts
import { router } from "./trpc";
import { authRouter } from "./routers/auth";
import { communityRouter } from "./routers/community";
import { managementRouter } from "./routers/management";
import { facilityRouter } from "./routers/facility";

export const appRouter = router({
  auth: authRouter,
  community: communityRouter,
  management: managementRouter,
  facility: facilityRouter,
});

export type AppRouter = typeof appRouter;
```

### 3.2 주요 API 엔드포인트

#### 인증 (Auth)

```typescript
// server/trpc/routers/auth.ts
export const authRouter = router({
  // 회원가입
  signUp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string(),
        apartmentId: z.string(),
        dong: z.string(),
        ho: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Supabase Auth 사용
    }),

  // 로그인
  signIn: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // JWT 토큰 발급
    }),

  // 프로필 조회
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),
});
```

#### 커뮤니티 (Community)

```typescript
// server/trpc/routers/community.ts
export const communityRouter = router({
  // 공지사항 목록
  getNotices: publicProcedure
    .input(
      z.object({
        apartmentId: z.string(),
        page: z.number().default(1),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      // 페이지네이션 적용
    }),

  // 게시글 작성
  createPost: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        category: z.enum(["notice", "free", "info", "lost"]),
        isAnonymous: z.boolean().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // 게시글 생성
    }),

  // 댓글 작성
  createComment: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // 댓글 생성 + 실시간 알림
    }),
});
```

#### 관리 (Management)

```typescript
// server/trpc/routers/management.ts
export const managementRouter = router({
  // 관리비 조회
  getManagementFee: protectedProcedure
    .input(
      z.object({
        year: z.number(),
        month: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      // 사용자의 관리비 조회
    }),

  // 민원 접수
  createComplaint: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        category: z.enum(["maintenance", "noise", "parking", "other"]),
        images: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // 민원 생성 + 관리사무소 알림
    }),

  // 민원 상태 조회
  getComplaintStatus: protectedProcedure
    .input(
      z.object({
        complaintId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      // 민원 처리 상태 조회
    }),
});
```

#### 시설 예약 (Facility)

```typescript
// server/trpc/routers/facility.ts
export const facilityRouter = router({
  // 예약 가능 시설 목록
  getFacilities: publicProcedure
    .input(
      z.object({
        apartmentId: z.string(),
      })
    )
    .query(async ({ input }) => {
      // 시설 목록 조회
    }),

  // 예약 가능 시간 조회
  getAvailableSlots: publicProcedure
    .input(
      z.object({
        facilityId: z.string(),
        date: z.string(),
      })
    )
    .query(async ({ input }) => {
      // 예약 가능 시간대 조회
    }),

  // 예약 생성
  createReservation: protectedProcedure
    .input(
      z.object({
        facilityId: z.string(),
        date: z.string(),
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // 예약 생성 + 충돌 검사
    }),
});
```

## 4. 데이터베이스 설계

### 4.1 Supabase 스키마

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

-- 공지사항
CREATE TABLE notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  apartment_id UUID REFERENCES apartments(id),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50),
  is_urgent BOOLEAN DEFAULT FALSE,
  author_id UUID REFERENCES users(id),
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 게시글
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  apartment_id UUID REFERENCES apartments(id),
  author_id UUID REFERENCES users(id),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50),
  is_anonymous BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 댓글
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 민원
CREATE TABLE complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  apartment_id UUID REFERENCES apartments(id),
  user_id UUID REFERENCES users(id),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending',
  images TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 시설
CREATE TABLE facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  apartment_id UUID REFERENCES apartments(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  capacity INTEGER,
  operating_hours JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 예약
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID REFERENCES facilities(id),
  user_id UUID REFERENCES users(id),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(facility_id, date, start_time)
);

-- 관리비
CREATE TABLE management_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  apartment_id UUID REFERENCES apartments(id),
  user_id UUID REFERENCES users(id),
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  details JSONB,
  paid BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4.2 Row Level Security (RLS)

```sql
-- 사용자는 자신의 아파트 데이터만 조회
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view posts from their apartment"
ON posts FOR SELECT
USING (apartment_id IN (
  SELECT apartment_id FROM users WHERE id = auth.uid()
));

CREATE POLICY "Users can create posts in their apartment"
ON posts FOR INSERT
WITH CHECK (
  apartment_id IN (
    SELECT apartment_id FROM users WHERE id = auth.uid()
  )
);
```

## 5. 캐싱 전략

### 5.1 Redis 캐싱

```typescript
// lib/redis.ts
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

// 캐싱 유틸리티
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  const cached = await redis.get<T>(key);
  if (cached) return cached;

  const data = await fetcher();
  await redis.setex(key, ttl, JSON.stringify(data));
  return data;
}
```

### 5.2 캐싱 전략

```typescript
// 공지사항 목록 (5분 캐시)
const notices = await getCached(
  `notices:${apartmentId}`,
  () => fetchNotices(apartmentId),
  300
);

// 시설 목록 (1시간 캐시)
const facilities = await getCached(
  `facilities:${apartmentId}`,
  () => fetchFacilities(apartmentId),
  3600
);

// 사용자 프로필 (10분 캐시)
const profile = await getCached(
  `user:${userId}`,
  () => fetchUserProfile(userId),
  600
);
```

## 6. 실시간 기능

### 6.1 Supabase Realtime

```typescript
// lib/realtime.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 새 댓글 실시간 구독
export function subscribeToComments(
  postId: string,
  callback: (comment: Comment) => void
) {
  return supabase
    .channel(`comments:${postId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "comments",
        filter: `post_id=eq.${postId}`,
      },
      (payload) => callback(payload.new as Comment)
    )
    .subscribe();
}

// 긴급 공지 실시간 구독
export function subscribeToUrgentNotices(
  apartmentId: string,
  callback: (notice: Notice) => void
) {
  return supabase
    .channel(`urgent:${apartmentId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notices",
        filter: `apartment_id=eq.${apartmentId},is_urgent=eq.true`,
      },
      (payload) => callback(payload.new as Notice)
    )
    .subscribe();
}
```

## 7. 인증 및 권한

### 7.1 인증 플로우

```typescript
// lib/auth.ts
import { createClient } from "@supabase/supabase-js";

export async function signUp(data: SignUpData) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 1. Supabase Auth 회원가입
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (error) throw error;

  // 2. 사용자 프로필 생성
  const { error: profileError } = await supabase.from("users").insert({
    id: authData.user!.id,
    email: data.email,
    name: data.name,
    apartment_id: data.apartmentId,
    dong: data.dong,
    ho: data.ho,
  });

  if (profileError) throw profileError;

  return authData;
}
```

### 7.2 권한 체크

```typescript
// server/trpc/middleware.ts
import { TRPCError } from "@trpc/server";

export const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

export const isAdmin = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({ ctx });
});

// 사용 예시
export const protectedProcedure = t.procedure.use(isAuthenticated);
export const adminProcedure = t.procedure.use(isAdmin);
```

## 8. 파일 업로드

### 8.1 Supabase Storage

```typescript
// lib/storage.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function uploadFile(file: File, bucket: string, path: string) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

// 민원 이미지 업로드
export async function uploadComplaintImage(userId: string, file: File) {
  const fileName = `${Date.now()}-${file.name}`;
  const path = `complaints/${userId}/${fileName}`;
  return uploadFile(file, "complaints", path);
}
```

## 9. 에러 처리

### 9.1 에러 타입 정의

```typescript
// lib/errors.ts
export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
  }
}

export const ErrorCodes = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  CONFLICT: "CONFLICT",
} as const;
```

### 9.2 에러 핸들러

```typescript
// server/trpc/trpc.ts
import { initTRPC, TRPCError } from "@trpc/server";

export const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});
```

## 10. 성능 최적화

### 10.1 데이터베이스 인덱스

```sql
-- 자주 조회되는 컬럼에 인덱스
CREATE INDEX idx_posts_apartment_id ON posts(apartment_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_reservations_facility_date ON reservations(facility_id, date);
```

### 10.2 쿼리 최적화

```typescript
// 페이지네이션 + 정렬
const posts = await supabase
  .from("posts")
  .select("*, author:users(name), comments(count)")
  .eq("apartment_id", apartmentId)
  .order("created_at", { ascending: false })
  .range(offset, offset + limit - 1);
```

## 11. 모니터링 및 로깅

### 11.1 로깅 전략

```typescript
// lib/logger.ts
import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

// 사용 예시
logger.info({ userId, action: "create_post" }, "User created a post");
logger.error({ error, userId }, "Failed to create post");
```

### 11.2 성능 모니터링

```typescript
// middleware/performance.ts
export const performanceMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();
  const result = await next();
  const duration = Date.now() - start;

  logger.info({ path, duration }, "API call completed");

  return result;
});
```

## 12. 배포 전략

### 12.1 환경 변수

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
UPSTASH_REDIS_URL=your_redis_url
UPSTASH_REDIS_TOKEN=your_redis_token
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:2555
```

### 12.2 Vercel 배포

```json
// vercel.json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

## 13. 보안 고려사항

### 13.1 보안 체크리스트

- [ ] SQL Injection 방지 (Prepared Statements)
- [ ] XSS 방지 (입력 검증 및 이스케이프)
- [ ] CSRF 방지 (NextAuth.js 기본 제공)
- [ ] Rate Limiting (Upstash Redis)
- [ ] 민감 정보 암호화 (환경 변수)
- [ ] HTTPS 강제 (Vercel 기본 제공)

### 13.2 Rate Limiting

```typescript
// lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

// 사용 예시
export const rateLimitMiddleware = t.middleware(async ({ ctx, next }) => {
  const identifier = ctx.user?.id || ctx.ip;
  const { success } = await ratelimit.limit(identifier);

  if (!success) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Too many requests",
    });
  }

  return next();
});
```

## 14. 다음 단계

### Phase 1 (1주)

- [ ] tRPC 라우터 기본 구조 구현
- [ ] Supabase 데이터베이스 스키마 생성
- [ ] 인증 시스템 구현

### Phase 2 (2주)

- [ ] 커뮤니티 API 구현
- [ ] 관리 API 구현
- [ ] 실시간 기능 구현

### Phase 3 (1주)

- [ ] 캐싱 전략 적용
- [ ] 성능 최적화
- [ ] 모니터링 설정

이 아키텍처는 확장 가능하고 유지보수가 용이하며, 2025년 최신 기술 트렌드를 반영한 설계입니다.
