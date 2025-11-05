# Upload API 500 에러 해결

_작성일: 2025-11-05_

_작성자: Developer Agent_

## 문제 상황

- `/api/upload` 엔드포인트에서 500 에러 발생
- 아바타 이미지 업로드 실패

## 원인 분석

1. **Supabase Storage 버킷 미생성**: `avatars` 버킷이 Supabase 프로젝트에 생성되지 않음
2. **에러 처리 부족**: 구체적인 에러 메시지가 로깅되지 않아 디버깅 어려움

## 해결 방법

### 1. Supabase Storage 버킷 생성

Supabase 대시보드에서 다음 단계를 수행:

1. https://supabase.com/dashboard 접속
2. 프로젝트 선택 (xbcrzucyjvsrucjqtoey)
3. 좌측 메뉴에서 **Storage** 클릭
4. **New bucket** 버튼 클릭
5. 버킷 설정:
   - **Name**: `avatars`
   - **Public bucket**: ✅ 체크 (공개 URL 접근 허용)
   - **File size limit**: 2MB
   - **Allowed MIME types**: `image/*`

### 2. 코드 개선

에러 처리 및 로깅 추가:

```typescript
try {
  const filename = `${session.user.id}/${Date.now()}-${file.name}`;
  const { data, error } = await uploadFile("avatars", filename, file);

  if (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: `Upload failed: ${error.message}` },
      { status: 500 }
    );
  }

  const publicUrl = getPublicUrl("avatars", data!.path);
  return NextResponse.json({ url: publicUrl });
} catch (error) {
  console.error("Unexpected error:", error);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
```

## 예방 방법

### 1. 환경 설정 체크리스트

프로젝트 초기 설정 시 다음 항목 확인:

- [ ] Supabase 프로젝트 생성
- [ ] 환경 변수 설정 (.env.local)
- [ ] Storage 버킷 생성
  - [ ] avatars (아바타 이미지)
  - [ ] posts (게시글 이미지)
  - [ ] notices (공지사항 이미지)
- [ ] RLS (Row Level Security) 정책 설정

### 2. Storage 버킷 정책 설정

각 버킷에 대한 접근 정책:

```sql
-- avatars 버킷: 인증된 사용자만 업로드, 모두 읽기 가능
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

### 3. 개발 환경 설정 문서화

`docs/developer/supabase-storage-setup.md` 파일 생성하여 설정 가이드 문서화

## 테스트 방법

1. 버킷 생성 후 개발 서버 재시작
2. MY 페이지에서 아바타 업로드 테스트
3. 브라우저 개발자 도구 Network 탭에서 응답 확인
4. 업로드된 이미지 URL 접근 가능 여부 확인

## 관련 파일

- `src/app/api/upload/route.ts` - 업로드 API 라우트
- `src/lib/storage.ts` - Storage 유틸리티 함수
- `src/lib/supabase.ts` - Supabase 클라이언트

## 참고 자료

- [Supabase Storage 공식 문서](https://supabase.com/docs/guides/storage)
- [Next.js API Routes 에러 처리](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#error-handling)
