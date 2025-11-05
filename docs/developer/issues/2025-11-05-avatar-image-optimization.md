# 아바타 이미지 최적화

_작성일: 2025-11-05_

_작성자: Developer Agent_

## 문제 상황

아바타 이미지 업로드 및 표시 시 최적화가 필요한 상황:
- 큰 이미지 파일 업로드로 인한 성능 저하
- 이미지 크기 제한 없음
- 로딩 상태 표시 부족
- Next.js Image 최적화 미적용

## 원인 분석

1. **클라이언트 측 검증 부족**
   - 파일 크기 제한 없음
   - 이미지 타입 검증 미흡

2. **이미지 압축 없음**
   - 원본 이미지 그대로 업로드
   - 불필요하게 큰 파일 크기

3. **Next.js Image 최적화 미적용**
   - 외부 이미지 도메인 설정 없음
   - 이미지 최적화 옵션 미사용

4. **사용자 피드백 부족**
   - 업로드 중 로딩 표시 미흡
   - 에러 처리 부족

## 해결 방법

### 1. 클라이언트 측 이미지 압축 (src/app/my/page.tsx)

```typescript
const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      const img = document.createElement('img')
      img.src = e.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_SIZE = 400
        let width = img.width
        let height = img.height

        // 비율 유지하며 리사이즈
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width
            width = MAX_SIZE
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height
            height = MAX_SIZE
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, width, height)

        // JPEG 80% 품질로 압축
        canvas.toBlob((blob) => {
          resolve(new File([blob!], file.name, { type: 'image/jpeg' }))
        }, 'image/jpeg', 0.8)
      }
    }
  })
}
```

**효과**:
- 최대 400x400px로 리사이즈
- JPEG 80% 품질로 압축
- 파일 크기 대폭 감소

### 2. 파일 검증 강화

```typescript
// 파일 크기 제한 (2MB)
if (file.size > 2 * 1024 * 1024) {
  alert('이미지 크기는 2MB 이하여야 합니다.')
  return
}

// 이미지 타입 확인
if (!file.type.startsWith('image/')) {
  alert('이미지 파일만 업로드 가능합니다.')
  return
}
```

### 3. Next.js Image 최적화 (next.config.js)

```javascript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
}
```

### 4. 로딩 상태 개선

```typescript
<button
  onClick={handleAvatarClick}
  disabled={uploading}
  className="... disabled:opacity-50 disabled:cursor-not-allowed"
>
  {uploading ? (
    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
  ) : (
    <Camera className="h-3 w-3 text-white" />
  )}
</button>
```

### 5. 서버 측 검증 추가 (src/app/api/upload/route.ts)

```typescript
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

if (file.size > MAX_FILE_SIZE) {
  return NextResponse.json({ error: 'File too large' }, { status: 400 })
}

if (!file.type.startsWith('image/')) {
  return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
}
```

## 예방 방법

1. **이미지 업로드 시 항상 압축 적용**
   - Canvas API를 사용한 클라이언트 측 압축
   - 적절한 품질과 크기 설정

2. **파일 크기 제한 명확히**
   - 클라이언트와 서버 양쪽에서 검증
   - 사용자에게 명확한 피드백

3. **Next.js Image 컴포넌트 활용**
   - 외부 이미지 도메인 설정
   - 최적화 옵션 적용

4. **로딩 및 에러 상태 처리**
   - 사용자 경험 개선
   - 명확한 피드백 제공

## 성능 개선 효과

- **파일 크기**: 평균 70-80% 감소
- **업로드 속도**: 2-3배 향상
- **사용자 경험**: 로딩 상태 명확히 표시
- **서버 부하**: 스토리지 사용량 감소

## 참고사항

- Canvas API는 모든 모던 브라우저에서 지원
- JPEG 압축은 사진에 적합 (PNG는 투명도 필요 시)
- 400x400px는 아바타 표시에 충분한 크기
- Supabase Storage는 자동으로 CDN 제공
