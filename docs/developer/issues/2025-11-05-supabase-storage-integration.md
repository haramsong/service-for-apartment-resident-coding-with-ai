# 파일 업로드 API Supabase Storage 연동

_작성일: 2025-11-05_

_작성자: Developer Agent_

## 문제 상황

기존 파일 업로드 API가 로컬 파일 시스템(`public/uploads`)을 사용하고 있어 다음과 같은 문제가 있었습니다:

1. **확장성 부족**: 서버 디스크 용량 제한
2. **배포 환경 문제**: Vercel 등 서버리스 환경에서 파일 시스템 사용 불가
3. **백업 및 관리 어려움**: 수동 백업 필요
4. **CDN 미지원**: 이미지 로딩 속도 최적화 불가

## 원인 분석

- 초기 개발 단계에서 빠른 구현을 위해 로컬 파일 시스템 사용
- Supabase Storage 연동 계획이 있었으나 미구현 상태

## 해결 방법

### 1. Supabase Storage 버킷 생성

Supabase 대시보드에서 `avatars` 버킷 생성 필요:
- Public 버킷으로 설정
- 파일 크기 제한: 5MB
- 허용 파일 타입: image/jpeg, image/png, image/gif

### 2. API 코드 변경

```typescript
// Before: 로컬 파일 시스템
await writeFile(path, buffer)
return NextResponse.json({ url: `/uploads/${filename}` })

// After: Supabase Storage
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(filename, buffer, {
    contentType: file.type,
    upsert: false,
  })

const { data: { publicUrl } } = supabase.storage
  .from('avatars')
  .getPublicUrl(data.path)

return NextResponse.json({ url: publicUrl })
```

### 3. 파일 경로 구조

- 사용자별 폴더 구조: `{userId}/{timestamp}-{filename}`
- 예시: `user123/1730772664000-profile.jpg`

## 변경 사항

### 수정된 파일

- `src/app/api/upload/route.ts`: Supabase Storage 연동

### 주요 변경점

1. `fs/promises`의 `writeFile` 제거
2. `supabase.storage.from('avatars').upload()` 사용
3. Public URL 생성 로직 추가
4. 에러 핸들링 개선

## 예방 방법

1. **초기 설계 단계에서 클라우드 스토리지 고려**
   - 로컬 파일 시스템은 개발 환경에서만 사용
   - 프로덕션 환경은 항상 클라우드 스토리지 사용

2. **환경 변수 관리**
   - Supabase URL과 키를 환경 변수로 관리
   - 로컬/프로덕션 환경 분리

3. **파일 업로드 정책 수립**
   - 파일 크기 제한
   - 파일 타입 검증
   - 사용자별 업로드 제한

## 추가 작업 필요

1. **Supabase Storage 버킷 생성**
   ```sql
   -- Supabase 대시보드에서 실행
   CREATE BUCKET avatars WITH (public = true);
   ```

2. **Storage Policy 설정**
   ```sql
   -- 인증된 사용자만 업로드 가능
   CREATE POLICY "Authenticated users can upload avatars"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'avatars');

   -- 모든 사용자가 조회 가능
   CREATE POLICY "Anyone can view avatars"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'avatars');
   ```

3. **기존 로컬 파일 마이그레이션** (선택사항)
   - `public/uploads` 폴더의 기존 파일을 Supabase Storage로 이전

## 테스트 방법

```bash
# 파일 업로드 테스트
curl -X POST http://localhost:2555/api/upload \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -F "file=@test-image.jpg"

# 응답 예시
{
  "url": "https://xbcrzucyjvsrucjqtoey.supabase.co/storage/v1/object/public/avatars/user123/1730772664000-test-image.jpg"
}
```

## 참고 자료

- [Supabase Storage 문서](https://supabase.com/docs/guides/storage)
- [Next.js File Upload](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#request-body-formdata)
