# Capacitor에서 PWA로 마이그레이션

_작성일: 2025-11-06_

_작성자: Developer Agent_

## 문제 상황

- 프로젝트가 Capacitor 기반 네이티브 앱 패키징으로 설정되어 있었음
- 웹 기반 PWA로 전환 필요

## 변경 사항

### 1. 패키지 변경

**제거된 패키지:**
- `@capacitor/core`
- `@capacitor/cli`
- `@capacitor/ios`
- `@capacitor/android`

**추가된 패키지:**
- `next-pwa@5.6.0`

### 2. 설정 파일 변경

**next.config.js:**
- `withPWA` 래퍼 추가
- PWA 설정 (dest, register, skipWaiting)
- 개발 환경에서는 PWA 비활성화
- `images.unoptimized` 제거 (PWA는 이미지 최적화 지원)

**삭제된 파일:**
- `capacitor.config.ts`

**추가된 파일:**
- `public/manifest.json` - PWA 매니페스트

### 3. package.json 스크립트 정리

**제거된 스크립트:**
- `build:mobile`
- `cap:add:ios`
- `cap:add:android`
- `cap:sync`
- `cap:open:ios`
- `cap:open:android`
- `cap:run:ios`
- `cap:run:android`

### 4. PWA 메타데이터 추가

**src/app/layout.tsx:**
- `manifest` 링크 추가
- `themeColor` 설정
- `viewport` 설정
- `appleWebApp` 설정 (iOS PWA 지원)

## PWA 기능

### 설치 가능
- 사용자가 홈 화면에 앱 추가 가능
- 네이티브 앱처럼 실행

### 오프라인 지원
- Service Worker를 통한 캐싱
- 오프라인에서도 기본 기능 사용 가능

### 푸시 알림
- 웹 푸시 알림 지원 (향후 구현 가능)

## 필요한 추가 작업

### 1. 아이콘 생성
다음 아이콘 파일들을 `public/` 디렉토리에 추가 필요:
- `icon-192x192.png`
- `icon-512x512.png`

### 2. Service Worker 커스터마이징 (선택사항)
필요시 `public/sw.js` 파일로 Service Worker 동작 커스터마이징 가능

### 3. 오프라인 페이지 (선택사항)
`public/offline.html` 추가하여 오프라인 상태 UI 개선 가능

## 테스트 방법

### 개발 환경
```bash
bun run dev
```
- 개발 환경에서는 PWA 기능 비활성화됨

### 프로덕션 빌드
```bash
bun run build
bun run start
```
- 프로덕션 빌드에서 PWA 기능 활성화
- Chrome DevTools > Application > Service Workers에서 확인

### PWA 설치 테스트
1. 프로덕션 빌드 실행
2. Chrome에서 주소창 오른쪽 "설치" 버튼 확인
3. 설치 후 독립 실행형 앱으로 실행 확인

## 장점

### Capacitor 대비 PWA의 장점
1. **간단한 배포**: 웹 호스팅만으로 배포 가능
2. **빠른 업데이트**: 앱 스토어 심사 없이 즉시 업데이트
3. **낮은 진입장벽**: 앱 스토어 다운로드 없이 바로 사용
4. **크로스 플랫폼**: 모든 플랫폼에서 동일한 경험
5. **유지보수 용이**: 단일 코드베이스

### 단점
1. **네이티브 기능 제한**: 일부 네이티브 API 접근 불가
2. **앱 스토어 부재**: 앱 스토어 검색 노출 불가
3. **iOS 제약**: iOS Safari의 PWA 지원 제한적

## 결론

웹 기반 아파트 커뮤니티 플랫폼의 특성상 PWA가 더 적합한 선택입니다:
- 빠른 배포와 업데이트
- 낮은 사용자 진입장벽
- 간단한 유지보수

향후 네이티브 기능이 필요할 경우 Capacitor 재도입 가능합니다.
