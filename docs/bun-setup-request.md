# 개발자 에이전트 - Bun 기반 초기 세팅 요청

## 🚀 패키지 매니저 변경
**npm → Bun 사용**으로 결정되었습니다.

## ✅ 현재 상태
- Bun 1.3.0 설치 완료 (`~/.bun/bin/bun`)
- 기본 package.json 생성 완료
- 프로젝트 디렉토리 구조 존재

## 📋 진행할 작업

### 1. Bun으로 패키지 설치
```bash
# 현재 디렉토리에서 실행
export PATH="$HOME/.bun/bin:$PATH"
bun install
```

### 2. Next.js 15 프로젝트 구조 생성
```bash
# 필요한 디렉토리 생성
mkdir -p src/{app,components/{ui,layout,features},lib,types}
mkdir -p public
```

### 3. 핵심 설정 파일들 생성
- `next.config.js` - Next.js 15 설정
- `tailwind.config.js` - 색상 시스템 (#2B5CE6, #F8F9FA)
- `tsconfig.json` - TypeScript 설정
- `src/app/layout.tsx` - 루트 레이아웃
- `src/app/page.tsx` - 홈페이지
- `src/app/globals.css` - 전역 스타일

### 4. shadcn/ui 초기화
```bash
bunx shadcn-ui@latest init
bunx shadcn-ui@latest add button card input textarea
```

### 5. 기본 컴포넌트 구현
- 하단 탭 네비게이션 (홈, 커뮤니티, 생활, 더보기)
- 기본 레이아웃 컴포넌트
- 색상 시스템 적용

## 🎯 목표
`bun dev` 명령어로 개발 서버가 정상 실행되고, 기본 UI가 표시되는 상태까지 완성

## 📚 참고 문서
- docs/tech-stack-recommendation-2025.md
- docs/ui-ux-guidelines-v2.md

**우선순위**: Bun 설치 → 패키지 설치 → Next.js 구조 → 기본 UI
