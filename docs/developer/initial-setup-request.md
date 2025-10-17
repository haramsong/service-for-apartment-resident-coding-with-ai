# 개발자 에이전트 초기 세팅 요청

## 🎯 요청 사항
추천된 기술 스택으로 프로젝트 초기 세팅을 진행해주세요.

## 📋 진행할 작업 목록

### 1. 프로젝트 초기화
```bash
# Next.js 15 프로젝트 생성
npx create-next-app@latest . --typescript --tailwind --app --src-dir

# 필수 패키지 설치
npm install @trpc/client @trpc/server @trpc/react-query @trpc/next
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install zustand socket.io-client next-pwa
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react

# 개발 도구
npm install -D @types/node eslint-config-next @typescript-eslint/eslint-plugin
```

### 2. 폴더 구조 생성
```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── layout/
│   └── features/
├── lib/
│   ├── utils.ts
│   ├── supabase.ts
│   └── trpc.ts
├── server/
│   └── trpc/
└── types/
```

### 3. 기본 설정 파일들
- `tailwind.config.js` - 색상 시스템 적용 (#2B5CE6, #F8F9FA)
- `next.config.js` - PWA 설정
- `.env.local.example` - 환경 변수 템플릿
- `tsconfig.json` - TypeScript 설정

### 4. shadcn/ui 초기 설정
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input textarea badge
```

### 5. 기본 컴포넌트 생성
- Layout 컴포넌트 (헤더, 하단 탭 네비게이션)
- 색상 시스템이 적용된 기본 UI 컴포넌트
- 로딩 및 에러 상태 컴포넌트

## 🎨 디자인 시스템 적용
docs/tech-stack-recommendation-2025.md의 색상 시스템을 tailwind.config.js에 적용:
- Primary: #2B5CE6
- Secondary: #F8F9FA  
- Text Primary: #1A1A1A
- Text Secondary: #6B7280

## 📱 하단 탭 네비게이션 구현
docs/ui-ux-guidelines-v2.md 참고하여 4개 탭 구조:
- 홈, 커뮤니티, 생활, 더보기

## ✅ 완료 후 확인사항
1. `npm run dev`로 개발 서버 정상 실행
2. 기본 레이아웃과 네비게이션 표시
3. Tailwind CSS 색상 시스템 적용 확인
4. TypeScript 컴파일 에러 없음

## 📚 참고 문서
- docs/tech-stack-recommendation-2025.md
- docs/ui-ux-guidelines-v2.md
- docs/development-kickoff-plan.md

**우선순위**: 개발 환경 설정 > 기본 구조 > 디자인 시스템 > 네비게이션
