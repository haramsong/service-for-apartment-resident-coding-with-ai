# Supabase Storage 설정 가이드

_작성일: 2025-11-05_

_작성자: Developer Agent_

## 개요

아파트 커뮤니티 플랫폼에서 사용하는 Supabase Storage 버킷 설정 가이드입니다.

## 필수 버킷 목록

| 버킷명 | 용도 | 공개 여부 | 파일 크기 제한 |
|--------|------|-----------|----------------|
| avatars | 사용자 아바타 이미지 | 공개 | 2MB |
| posts | 게시글 첨부 이미지 | 공개 | 5MB |
| notices | 공지사항 첨부 이미지 | 공개 | 5MB |

## 버킷 생성 방법

### 1. Supabase 대시보드 접속

1. https://supabase.com/dashboard 접속
2. 프로젝트 선택: `xbcrzucyjvsrucjqtoey`
3. 좌측 메뉴에서 **Storage** 클릭

### 2. avatars 버킷 생성

1. **New bucket** 버튼 클릭
2. 설정:
   - **Name**: `avatars`
   - **Public bucket**: ✅ 체크
   - **File size limit**: 2097152 (2MB)
   - **Allowed MIME types**: `image/jpeg,image/png,image/webp`
3. **Create bucket** 클릭

### 3. posts 버킷 생성

1. **New bucket** 버튼 클릭
2. 설정:
   - **Name**: `posts`
   - **Public bucket**: ✅ 체크
   - **File size limit**: 5242880 (5MB)
   - **Allowed MIME types**: `image/jpeg,image/png,image/webp`
3. **Create bucket** 클릭

### 4. notices 버킷 생성

1. **New bucket** 버튼 클릭
2. 설정:
   - **Name**: `notices`
   - **Public bucket**: ✅ 체크
   - **File size limit**: 5242880 (5MB)
   - **Allowed MIME types**: `image/jpeg,image/png,image/webp`
3. **Create bucket** 클릭

## RLS 정책 설정

각 버킷에 대한 Row Level Security 정책을 설정합니다.

### avatars 버킷 정책

```sql
-- 인증된 사용자만 업로드 가능
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- 모든 사용자가 읽기 가능
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- 본인 파일만 삭제 가능
CREATE POLICY "Users can delete own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### posts 버킷 정책

```sql
-- 인증된 사용자만 업로드 가능
CREATE POLICY "Authenticated users can upload post images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'posts');

-- 모든 사용자가 읽기 가능
CREATE POLICY "Anyone can view post images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'posts');

-- 본인 파일만 삭제 가능
CREATE POLICY "Users can delete own post images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'posts' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### notices 버킷 정책

```sql
-- 관리자만 업로드 가능
CREATE POLICY "Admins can upload notice images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'notices' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 모든 사용자가 읽기 가능
CREATE POLICY "Anyone can view notice images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'notices');

-- 관리자만 삭제 가능
CREATE POLICY "Admins can delete notice images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'notices' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

## 정책 적용 방법

1. Supabase 대시보드에서 **SQL Editor** 클릭
2. 위의 SQL 쿼리를 복사하여 붙여넣기
3. **Run** 버튼 클릭하여 실행

## 환경 변수 확인

`.env.local` 파일에 다음 환경 변수가 설정되어 있는지 확인:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xbcrzucyjvsrucjqtoey.supabase.com
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 테스트 방법

### 1. 버킷 생성 확인

```bash
# Supabase CLI 사용 (선택사항)
supabase storage list
```

### 2. 업로드 테스트

1. 개발 서버 실행: `bun run dev`
2. MY 페이지 접속
3. 아바타 이미지 업로드 시도
4. 브라우저 개발자 도구에서 네트워크 요청 확인

### 3. 공개 URL 접근 테스트

업로드된 이미지 URL을 브라우저에서 직접 접근하여 이미지가 표시되는지 확인

## 문제 해결

### 업로드 실패 시

1. **버킷이 존재하는지 확인**
   - Supabase 대시보드 > Storage에서 버킷 목록 확인

2. **RLS 정책 확인**
   - SQL Editor에서 정책이 올바르게 생성되었는지 확인

3. **환경 변수 확인**
   - `.env.local` 파일의 Supabase 키 확인
   - 개발 서버 재시작

4. **로그 확인**
   - 터미널에서 에러 메시지 확인
   - 브라우저 개발자 도구 Console 탭 확인

## 참고 자료

- [Supabase Storage 공식 문서](https://supabase.com/docs/guides/storage)
- [Supabase RLS 정책 가이드](https://supabase.com/docs/guides/auth/row-level-security)
