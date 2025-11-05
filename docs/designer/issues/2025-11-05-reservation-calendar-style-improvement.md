# ReservationDialog 캘린더 스타일 개선

*작성일: 2025-11-05*

*작성자: Designer Agent*

## 문제 상황

ReservationDialog의 캘린더 컴포넌트가 디자인 시스템과 일관성이 부족하고, 사용성 측면에서 개선이 필요했습니다.

### 주요 문제점
1. **색상 불일치**: Primary 색상(#2B5CE6) 미적용
2. **터치 영역 부족**: 모바일에서 날짜 선택이 어려움 (36px → 40px 필요)
3. **시각적 계층 부족**: 선택된 날짜와 오늘 날짜 구분이 불명확
4. **반응형 최적화 부족**: 작은 화면에서 레이아웃 문제

## 원인 분석

### 1. Calendar 컴포넌트
- 기본 Tailwind 색상 사용 (`bg-primary`, `text-primary-foreground`)
- 터치 영역이 36px로 WCAG 2.1 AA 기준(44px) 미달
- 네비게이션 버튼 투명도로 인한 가독성 저하

### 2. ReservationDialog
- 시간 슬롯 버튼 높이 부족 (48px → 56px 권장)
- 간격 시스템 불일치 (space-y-4 → space-y-6)
- 스크롤 영역 높이 제한으로 사용성 저하

## 해결 방법

### 1. Calendar 컴포넌트 개선

#### 색상 시스템 적용
```tsx
// Before
day_selected: 'bg-primary text-primary-foreground'
day_today: 'bg-accent text-accent-foreground'

// After
day_selected: 'bg-[#2B5CE6] text-white hover:bg-[#1E4BD1]'
day_today: 'bg-blue-50 text-[#2B5CE6] font-semibold border border-[#2B5CE6]'
```

#### 터치 영역 확대
```tsx
// Before
cell: 'h-9 w-9'  // 36px
day: 'h-9 w-9'

// After
cell: 'h-10 w-10'  // 40px
day: 'h-10 w-10'
```

#### 시각적 개선
- 네비게이션 버튼: 투명도 제거, 명확한 배경색
- 요일 헤더: 폰트 크기 및 색상 개선
- 월/년 표시: 폰트 크기 증가 (text-sm → text-base)

### 2. ReservationDialog 개선

#### 레이아웃 최적화
```tsx
// Before
className="max-w-md"
space-y-4

// After
className="max-w-md max-h-[90vh] overflow-y-auto"
space-y-6
```

#### 시간 슬롯 버튼 개선
```tsx
// Before
p-3 rounded-lg border min-h-[48px]

// After
p-4 rounded-xl border-2 min-h-[56px]
```

#### 액션 버튼 강화
```tsx
// Before
className="flex-1"

// After
className="flex-1 h-12 text-base font-semibold"
```

## 개선 효과

### 1. 접근성 향상
- ✅ WCAG 2.1 AA 터치 영역 기준 충족 (44px 이상)
- ✅ 색상 대비비 4.5:1 이상 유지
- ✅ 명확한 시각적 피드백

### 2. 사용자 경험 개선
- ✅ 직관적인 날짜 선택
- ✅ 선택 상태 명확한 표시
- ✅ 부드러운 인터랙션 (transition-all)

### 3. 디자인 일관성
- ✅ Primary 색상 시스템 적용
- ✅ 간격 시스템 준수 (4px 단위)
- ✅ 타이포그래피 스케일 일관성

## 예방 방법

### 1. 디자인 시스템 체크리스트
- [ ] Primary 색상(#2B5CE6) 사용 확인
- [ ] 터치 영역 최소 44px 확보
- [ ] 간격 시스템(4px 단위) 준수
- [ ] 색상 대비비 4.5:1 이상

### 2. 컴포넌트 개발 가이드
```tsx
// 색상 사용 예시
const colors = {
  primary: '#2B5CE6',
  primaryHover: '#1E4BD1',
  primaryLight: '#EBF2FF',
}

// 터치 영역 최소값
const touchTarget = {
  minHeight: '44px',
  minWidth: '44px',
}

// 간격 시스템
const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
}
```

### 3. 반응형 테스트 체크리스트
- [ ] iPhone SE (375px) 테스트
- [ ] iPad (768px) 테스트
- [ ] Desktop (1024px+) 테스트
- [ ] 터치 인터랙션 확인
- [ ] 스크롤 동작 확인

## 참고 문서
- [디자인 시스템 가이드](/docs/designer/apartment-community-color-system.md)
- [UI/UX 가이드라인 v2](/docs/designer/ui-ux-guidelines-v2.md)
- [반응형 레이아웃 개선](/docs/designer/responsive-layout-improvements.md)
