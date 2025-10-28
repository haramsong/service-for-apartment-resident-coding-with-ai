# API 명세서

*작성일: 2025-10-28*

*작성자: Developer Agent*

*버전: v1.0*

## 1. 개요

### API 아키텍처
- **프레임워크**: tRPC v11
- **타입 안전성**: End-to-End TypeScript
- **인증**: JWT 기반 세션 관리
- **실시간**: Supabase Realtime

### Base URL
```
Development: http://localhost:3000/api/trpc
Production: https://yourdomain.com/api/trpc
```

## 2. 인증 (Auth)

### 2.1 회원가입
```typescript
auth.signUp
```

**Input:**
```typescript
{
  email: string;        // 이메일 (필수)
  password: string;     // 비밀번호 8자 이상 (필수)
  name: string;         // 이름 (필수)
  apartmentId: string;  // 아파트 ID (필수)
  dong: string;         // 동 (필수)
  ho: string;           // 호 (필수)
}
```

**Output:**
```typescript
{
  user: {
    id: string;
    email: string;
    name: string;
    apartmentId: string;
    dong: string;
    ho: string;
    role: 'resident' | 'admin';
  };
  session: {
    accessToken: string;
    refreshToken: string;
  };
}
```

**에러:**
- `CONFLICT`: 이미 존재하는 이메일
- `BAD_REQUEST`: 유효하지 않은 입력값

### 2.2 로그인
```typescript
auth.signIn
```

**Input:**
```typescript
{
  email: string;
  password: string;
}
```

**Output:**
```typescript
{
  user: User;
  session: Session;
}
```

**에러:**
- `UNAUTHORIZED`: 잘못된 이메일 또는 비밀번호
- `NOT_FOUND`: 존재하지 않는 사용자

### 2.3 로그아웃
```typescript
auth.signOut
```

**Input:** 없음 (세션에서 자동 추출)

**Output:**
```typescript
{
  success: boolean;
}
```

### 2.4 프로필 조회
```typescript
auth.getProfile
```

**인증 필요**: ✅

**Input:** 없음

**Output:**
```typescript
{
  id: string;
  email: string;
  name: string;
  apartment: {
    id: string;
    name: string;
  };
  dong: string;
  ho: string;
  role: 'resident' | 'admin';
  createdAt: Date;
}
```

## 3. 공지사항 (Notices)

### 3.1 공지사항 목록 조회
```typescript
notices.getList
```

**Input:**
```typescript
{
  apartmentId: string;
  page?: number;        // 기본값: 1
  limit?: number;       // 기본값: 20
  category?: string;    // 선택적 필터
  isUrgent?: boolean;   // 긴급 공지만 조회
}
```

**Output:**
```typescript
{
  items: Notice[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  isUrgent: boolean;
  views: number;
  author: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.2 공지사항 상세 조회
```typescript
notices.getById
```

**Input:**
```typescript
{
  id: string;
}
```

**Output:**
```typescript
{
  id: string;
  title: string;
  content: string;
  category: string;
  isUrgent: boolean;
  views: number;
  author: {
    id: string;
    name: string;
    role: string;
  };
  apartment: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

**에러:**
- `NOT_FOUND`: 존재하지 않는 공지사항

### 3.3 공지사항 작성
```typescript
notices.create
```

**인증 필요**: ✅ (관리자만)

**Input:**
```typescript
{
  title: string;        // 최대 200자
  content: string;
  category: string;
  isUrgent: boolean;
}
```

**Output:**
```typescript
{
  id: string;
  title: string;
  content: string;
  category: string;
  isUrgent: boolean;
  createdAt: Date;
}
```

**에러:**
- `FORBIDDEN`: 권한 없음 (관리자 아님)
- `BAD_REQUEST`: 유효하지 않은 입력값

### 3.4 공지사항 수정
```typescript
notices.update
```

**인증 필요**: ✅ (관리자만)

**Input:**
```typescript
{
  id: string;
  title?: string;
  content?: string;
  category?: string;
  isUrgent?: boolean;
}
```

**Output:**
```typescript
{
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
}
```

### 3.5 공지사항 삭제
```typescript
notices.delete
```

**인증 필요**: ✅ (관리자만)

**Input:**
```typescript
{
  id: string;
}
```

**Output:**
```typescript
{
  success: boolean;
}
```

## 4. 게시판 (Posts)

### 4.1 게시글 목록 조회
```typescript
posts.getList
```

**Input:**
```typescript
{
  apartmentId: string;
  page?: number;
  limit?: number;
  category?: string;
  sortBy?: 'latest' | 'popular';  // 기본값: 'latest'
}
```

**Output:**
```typescript
{
  items: Post[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  isAnonymous: boolean;
  views: number;
  likes: number;
  commentCount: number;
  author: {
    id: string;
    name: string;  // 익명일 경우 "익명"
  };
  createdAt: Date;
}
```

### 4.2 게시글 상세 조회
```typescript
posts.getById
```

**Input:**
```typescript
{
  id: string;
}
```

**Output:**
```typescript
{
  id: string;
  title: string;
  content: string;
  category: string;
  isAnonymous: boolean;
  views: number;
  likes: number;
  author: {
    id: string;
    name: string;
  };
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}
```

### 4.3 게시글 작성
```typescript
posts.create
```

**인증 필요**: ✅

**Input:**
```typescript
{
  title: string;
  content: string;
  category: string;
  isAnonymous?: boolean;  // 기본값: false
}
```

**Output:**
```typescript
{
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}
```

### 4.4 게시글 수정
```typescript
posts.update
```

**인증 필요**: ✅ (작성자만)

**Input:**
```typescript
{
  id: string;
  title?: string;
  content?: string;
  category?: string;
}
```

**Output:**
```typescript
{
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
}
```

**에러:**
- `FORBIDDEN`: 작성자가 아님

### 4.5 게시글 삭제
```typescript
posts.delete
```

**인증 필요**: ✅ (작성자 또는 관리자)

**Input:**
```typescript
{
  id: string;
}
```

**Output:**
```typescript
{
  success: boolean;
}
```

### 4.6 게시글 좋아요
```typescript
posts.like
```

**인증 필요**: ✅

**Input:**
```typescript
{
  postId: string;
}
```

**Output:**
```typescript
{
  likes: number;
  isLiked: boolean;
}
```

## 5. 댓글 (Comments)

### 5.1 댓글 목록 조회
```typescript
comments.getList
```

**Input:**
```typescript
{
  postId: string;
  page?: number;
  limit?: number;
}
```

**Output:**
```typescript
{
  items: Comment[];
  total: number;
}

interface Comment {
  id: string;
  content: string;
  isAnonymous: boolean;
  author: {
    id: string;
    name: string;
  };
  createdAt: Date;
}
```

### 5.2 댓글 작성
```typescript
comments.create
```

**인증 필요**: ✅

**Input:**
```typescript
{
  postId: string;
  content: string;
  isAnonymous?: boolean;
}
```

**Output:**
```typescript
{
  id: string;
  content: string;
  createdAt: Date;
}
```

### 5.3 댓글 삭제
```typescript
comments.delete
```

**인증 필요**: ✅ (작성자 또는 관리자)

**Input:**
```typescript
{
  id: string;
}
```

**Output:**
```typescript
{
  success: boolean;
}
```

## 6. 민원 (Complaints)

### 6.1 민원 목록 조회
```typescript
complaints.getList
```

**인증 필요**: ✅

**Input:**
```typescript
{
  page?: number;
  limit?: number;
  status?: 'pending' | 'processing' | 'completed';
}
```

**Output:**
```typescript
{
  items: Complaint[];
  total: number;
}

interface Complaint {
  id: string;
  title: string;
  category: string;
  status: 'pending' | 'processing' | 'completed';
  createdAt: Date;
}
```

### 6.2 민원 상세 조회
```typescript
complaints.getById
```

**인증 필요**: ✅

**Input:**
```typescript
{
  id: string;
}
```

**Output:**
```typescript
{
  id: string;
  title: string;
  content: string;
  category: string;
  status: string;
  images: string[];
  user: {
    id: string;
    name: string;
    dong: string;
    ho: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### 6.3 민원 접수
```typescript
complaints.create
```

**인증 필요**: ✅

**Input:**
```typescript
{
  title: string;
  content: string;
  category: 'maintenance' | 'noise' | 'parking' | 'other';
  images?: string[];  // 이미지 URL 배열
}
```

**Output:**
```typescript
{
  id: string;
  title: string;
  status: 'pending';
  createdAt: Date;
}
```

### 6.4 민원 상태 변경
```typescript
complaints.updateStatus
```

**인증 필요**: ✅ (관리자만)

**Input:**
```typescript
{
  id: string;
  status: 'pending' | 'processing' | 'completed';
}
```

**Output:**
```typescript
{
  id: string;
  status: string;
  updatedAt: Date;
}
```

## 7. 시설 예약 (Reservations)

### 7.1 시설 목록 조회
```typescript
facilities.getList
```

**Input:**
```typescript
{
  apartmentId: string;
}
```

**Output:**
```typescript
{
  items: Facility[];
}

interface Facility {
  id: string;
  name: string;
  description: string;
  capacity: number;
  operatingHours: {
    start: string;
    end: string;
  };
}
```

### 7.2 예약 가능 시간 조회
```typescript
reservations.getAvailableSlots
```

**Input:**
```typescript
{
  facilityId: string;
  date: string;  // YYYY-MM-DD
}
```

**Output:**
```typescript
{
  date: string;
  slots: TimeSlot[];
}

interface TimeSlot {
  startTime: string;  // HH:mm
  endTime: string;
  isAvailable: boolean;
}
```

### 7.3 예약 생성
```typescript
reservations.create
```

**인증 필요**: ✅

**Input:**
```typescript
{
  facilityId: string;
  date: string;
  startTime: string;
  endTime: string;
}
```

**Output:**
```typescript
{
  id: string;
  facility: {
    id: string;
    name: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  status: 'confirmed';
  createdAt: Date;
}
```

**에러:**
- `CONFLICT`: 이미 예약된 시간
- `BAD_REQUEST`: 운영 시간 외 예약

### 7.4 내 예약 목록 조회
```typescript
reservations.getMyList
```

**인증 필요**: ✅

**Input:**
```typescript
{
  status?: 'confirmed' | 'cancelled';
  page?: number;
  limit?: number;
}
```

**Output:**
```typescript
{
  items: Reservation[];
  total: number;
}
```

### 7.5 예약 취소
```typescript
reservations.cancel
```

**인증 필요**: ✅

**Input:**
```typescript
{
  id: string;
}
```

**Output:**
```typescript
{
  id: string;
  status: 'cancelled';
  updatedAt: Date;
}
```

## 8. 관리비 (Management Fees)

### 8.1 관리비 조회
```typescript
managementFees.getByMonth
```

**인증 필요**: ✅

**Input:**
```typescript
{
  year: number;
  month: number;
}
```

**Output:**
```typescript
{
  id: string;
  year: number;
  month: number;
  amount: number;
  details: {
    electricity: number;
    water: number;
    gas: number;
    maintenance: number;
    etc: number;
  };
  paid: boolean;
  paidAt?: Date;
  dueDate: Date;
}
```

### 8.2 관리비 내역 목록
```typescript
managementFees.getList
```

**인증 필요**: ✅

**Input:**
```typescript
{
  year?: number;
  limit?: number;  // 기본값: 12
}
```

**Output:**
```typescript
{
  items: ManagementFee[];
  total: number;
}
```

## 9. 에러 코드

### 공통 에러
```typescript
{
  code: string;
  message: string;
  details?: any;
}
```

**에러 코드:**
- `UNAUTHORIZED`: 인증 필요
- `FORBIDDEN`: 권한 없음
- `NOT_FOUND`: 리소스 없음
- `BAD_REQUEST`: 잘못된 요청
- `CONFLICT`: 충돌 (중복 등)
- `INTERNAL_SERVER_ERROR`: 서버 오류
- `TOO_MANY_REQUESTS`: 요청 제한 초과

## 10. Rate Limiting

### 제한 정책
- **일반 API**: 10 requests / 10초
- **인증 API**: 5 requests / 10초
- **파일 업로드**: 3 requests / 10초

### 응답 헤더
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1635724800
```

## 11. 페이지네이션

### 표준 형식
```typescript
{
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
```

### 기본값
- `page`: 1
- `limit`: 20
- `maxLimit`: 100

## 12. 실시간 구독 (Supabase Realtime)

### 12.1 새 공지사항 구독
```typescript
// 클라이언트 코드
supabase
  .channel('notices')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'notices',
    filter: `apartment_id=eq.${apartmentId}`
  }, (payload) => {
    console.log('새 공지사항:', payload.new)
  })
  .subscribe()
```

### 12.2 댓글 실시간 업데이트
```typescript
supabase
  .channel(`comments:${postId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'comments',
    filter: `post_id=eq.${postId}`
  }, (payload) => {
    console.log('새 댓글:', payload.new)
  })
  .subscribe()
```

## 13. 파일 업로드

### 13.1 이미지 업로드
```typescript
// Supabase Storage 사용
const { data, error } = await supabase.storage
  .from('complaints')
  .upload(`${userId}/${fileName}`, file)
```

**제한사항:**
- 최대 파일 크기: 5MB
- 허용 형식: jpg, jpeg, png, gif
- 최대 파일 수: 5개

## 14. 보안

### 인증 토큰
- **Access Token**: 1시간 유효
- **Refresh Token**: 7일 유효
- **헤더**: `Authorization: Bearer {token}`

### CORS
```
Allowed Origins: 
- http://localhost:3000 (개발)
- https://yourdomain.com (프로덕션)
```

### HTTPS
- 프로덕션 환경에서 HTTPS 필수
- 개발 환경에서는 HTTP 허용

---

*이 API 명세서는 프로젝트 진행에 따라 지속적으로 업데이트됩니다.*
