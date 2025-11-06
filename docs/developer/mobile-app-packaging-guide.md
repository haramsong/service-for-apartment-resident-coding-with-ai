# 모바일 앱 패키징 가이드

_작성일: 2025-11-06_

_작성자: Developer Agent_

## 개요

Capacitor를 사용하여 Next.js 웹 앱을 iOS/Android 네이티브 앱으로 패키징하는 가이드입니다.

## 설치된 패키지

- `@capacitor/core`: Capacitor 코어 라이브러리
- `@capacitor/cli`: Capacitor CLI 도구
- `@capacitor/ios`: iOS 플랫폼 지원
- `@capacitor/android`: Android 플랫폼 지원

## 프로젝트 설정

### 1. Next.js 설정 (next.config.js)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Static export 활성화
  images: {
    unoptimized: true,  // 이미지 최적화 비활성화 (static export 필수)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  trailingSlash: true,  // URL 끝에 슬래시 추가
}
```

### 2. Capacitor 설정 (capacitor.config.ts)

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.apartment.community',
  appName: '우리동네',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#2B5CE6',
      showSpinner: false,
    },
  },
};
```

## 빌드 및 배포 프로세스

### 1. 웹 앱 빌드

```bash
# Next.js 정적 빌드 (out/ 디렉토리 생성)
bun run build
```

### 2. iOS 플랫폼 추가 (최초 1회)

```bash
# iOS 프로젝트 생성
bun run cap:add:ios

# 또는
bunx cap add ios
```

**요구사항**:
- macOS 필수
- Xcode 설치 필요
- CocoaPods 설치 필요

### 3. Android 플랫폼 추가 (최초 1회)

```bash
# Android 프로젝트 생성
bun run cap:add:android

# 또는
bunx cap add android
```

**요구사항**:
- Android Studio 설치 필요
- Java JDK 17+ 설치 필요

### 4. 웹 앱 동기화

```bash
# 빌드 + 동기화 (권장)
bun run build:mobile

# 또는 동기화만
bun run cap:sync
```

이 명령어는:
1. Next.js 빌드 실행 (`out/` 생성)
2. 빌드된 파일을 iOS/Android 프로젝트로 복사
3. 네이티브 플러그인 동기화

### 5. 네이티브 IDE에서 열기

#### iOS (Xcode)

```bash
bun run cap:open:ios
```

Xcode에서:
1. 시뮬레이터 또는 실제 기기 선택
2. Run 버튼 클릭
3. 앱 테스트

#### Android (Android Studio)

```bash
bun run cap:open:android
```

Android Studio에서:
1. 에뮬레이터 또는 실제 기기 선택
2. Run 버튼 클릭
3. 앱 테스트

## 개발 워크플로우

### 일반적인 개발 흐름

1. **웹 개발**: `bun run dev`로 웹 앱 개발
2. **빌드**: `bun run build`로 정적 파일 생성
3. **동기화**: `bun run cap:sync`로 네이티브 프로젝트 업데이트
4. **테스트**: 네이티브 IDE에서 앱 실행 및 테스트

### 코드 변경 시

```bash
# 1. 웹 앱 빌드
bun run build

# 2. 네이티브 프로젝트 동기화
bun run cap:sync

# 3. 네이티브 IDE에서 재실행
```

## 주의사항

### Next.js Static Export 제약사항

Static export 모드에서는 다음 기능들이 제한됩니다:

1. **API Routes 사용 불가**
   - 해결: 외부 API 서버 사용 (Supabase, tRPC 등)
   - 현재 프로젝트는 Supabase + tRPC 사용으로 문제 없음

2. **Server-Side Rendering (SSR) 불가**
   - 모든 페이지가 빌드 타임에 정적 HTML로 생성
   - 동적 데이터는 클라이언트에서 fetch

3. **Image Optimization 비활성화**
   - `images.unoptimized: true` 설정 필요
   - 이미지 최적화는 수동으로 처리

4. **Dynamic Routes 제한**
   - `generateStaticParams` 사용 필요
   - 또는 클라이언트 사이드 라우팅 활용

### 환경 변수 처리

모바일 앱에서는 빌드 타임에 환경 변수가 번들에 포함됩니다:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

- `NEXT_PUBLIC_` 접두사가 있는 변수만 클라이언트에서 접근 가능
- 민감한 정보는 절대 `NEXT_PUBLIC_`로 시작하지 말 것

## 배포

### iOS App Store

1. **Apple Developer 계정** 필요 (연간 $99)
2. **Xcode에서 Archive** 생성
3. **App Store Connect**에 업로드
4. **심사 제출**

### Google Play Store

1. **Google Play Console 계정** 필요 (일회성 $25)
2. **Android Studio에서 APK/AAB** 생성
3. **Play Console**에 업로드
4. **심사 제출**

## 트러블슈팅

### iOS 빌드 오류

```bash
# CocoaPods 재설치
cd ios/App
pod install
cd ../..
```

### Android 빌드 오류

```bash
# Gradle 캐시 정리
cd android
./gradlew clean
cd ..
```

### 동기화 문제

```bash
# 완전히 재동기화
rm -rf ios android
bun run cap:add:ios
bun run cap:add:android
bun run build:mobile
```

## 유용한 명령어 요약

| 명령어 | 설명 |
|--------|------|
| `bun run build` | Next.js 정적 빌드 |
| `bun run build:mobile` | 빌드 + 동기화 |
| `bun run cap:add:ios` | iOS 플랫폼 추가 |
| `bun run cap:add:android` | Android 플랫폼 추가 |
| `bun run cap:sync` | 네이티브 프로젝트 동기화 |
| `bun run cap:open:ios` | Xcode 열기 |
| `bun run cap:open:android` | Android Studio 열기 |

## 참고 자료

- [Capacitor 공식 문서](https://capacitorjs.com/docs)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [iOS 배포 가이드](https://capacitorjs.com/docs/ios/deploying-to-app-store)
- [Android 배포 가이드](https://capacitorjs.com/docs/android/deploying-to-google-play)
