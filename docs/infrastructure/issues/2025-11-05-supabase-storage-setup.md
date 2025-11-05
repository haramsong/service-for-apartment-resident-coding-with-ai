# Supabase Storage 버킷 연동

*작성일: 2025-11-05*

*작성자: DevOps Agent*

## 문제 상황
프로젝트에서 이미지 및 파일 업로드 기능이 필요하지만 Storage 시스템이 구축되지 않음

## 해결 방법

### 1. Supabase 클라이언트 설치
```bash
bun add @supabase/supabase-js
```

### 2. 파일 구조
```
src/lib/
├── supabase.ts    # Supabase 클라이언트 초기화
└── storage.ts     # Storage 유틸리티 함수
```

### 3. 환경 변수 설정
`.env.local`에 추가:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Supabase 대시보드 설정

#### 버킷 생성
1. Supabase 대시보드 접속
2. Storage 메뉴 선택
3. 다음 버킷 생성:
   - `avatars` (Public)
   - `posts` (Public)
   - `notices` (Public)

#### 정책 설정 (RLS)
각 버킷에 대해 다음 정책 추가:

**업로드 정책**:
```sql
CREATE POLICY "인증된 사용자 업로드"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');
```

**조회 정책**:
```sql
CREATE POLICY "모든 사용자 조회"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

**삭제 정책**:
```sql
CREATE POLICY "본인 파일 삭제"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid() = owner);
```

### 5. 사용 예시

```typescript
import { uploadFile, getPublicUrl, STORAGE_BUCKETS } from '@/lib/storage';

// 파일 업로드
const file = event.target.files[0];
const path = `${userId}/${Date.now()}-${file.name}`;
await uploadFile(STORAGE_BUCKETS.AVATARS, path, file);

// URL 가져오기
const url = await getPublicUrl(STORAGE_BUCKETS.AVATARS, path);
```

## 예방 방법

### 보안 체크리스트
- [ ] RLS 정책 활성화 확인
- [ ] Public 버킷은 읽기만 허용
- [ ] 파일 크기 제한 설정 (Supabase 대시보드)
- [ ] 허용 파일 타입 제한 (클라이언트 검증)

### 성능 최적화
- 이미지는 업로드 전 리사이징 권장
- CDN 캐싱 활용 (Supabase 자동 제공)
- 파일명에 타임스탬프 포함으로 캐시 무효화

## 참고사항
- Supabase Free Tier: 1GB Storage
- 파일 크기 제한: 50MB (기본값)
- 지원 형식: 모든 파일 타입
