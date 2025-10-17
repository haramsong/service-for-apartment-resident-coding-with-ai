# Figma 디자인 시스템 구축 가이드

*작성일: 2025-10-16*  
*작성자: Designer Agent*  
*버전: v1.0*

## 1. Figma 파일 구조 설정

### 파일 조직
```
📁 Apartment Community Design System
├── 🎨 Design System (메인 라이브러리)
├── 📱 Mobile Screens
├── 💻 Desktop Screens
└── 🔄 Prototypes
```

### 페이지 구성
- **Foundations**: 컬러, 타이포그래피, 스페이싱, 그리드
- **Components**: 기본 컴포넌트들
- **Patterns**: 복합 컴포넌트와 템플릿
- **Documentation**: 사용 가이드

## 2. 디자인 토큰 설정

### 컬러 시스템
```
Primary Colors:
- Primary/500: #2563EB (메인 브랜드)
- Primary/400: #3B82F6
- Primary/600: #1D4ED8

Semantic Colors:
- Success: #10B981
- Warning: #F59E0B
- Error: #EF4444
- Info: #06B6D4

Neutral Colors:
- Gray/50: #F9FAFB
- Gray/100: #F3F4F6
- Gray/900: #111827
```

### 타이포그래피 스케일
```
Heading 1: 32px/40px, Bold
Heading 2: 24px/32px, Bold
Heading 3: 20px/28px, SemiBold
Body Large: 16px/24px, Regular
Body: 14px/20px, Regular
Caption: 12px/16px, Regular
```

## 3. 컴포넌트 라이브러리 구축

### 기본 컴포넌트 우선순위
1. **Button** (Primary, Secondary, Text, Icon)
2. **Input Field** (Text, Password, Search)
3. **Card** (Notice, Community Post, Profile)
4. **Navigation** (Tab Bar, Header, Sidebar)
5. **Modal** (Alert, Confirmation, Form)

### 컴포넌트 네이밍 규칙
```
Component/Variant/State
예: Button/Primary/Default
    Button/Primary/Hover
    Button/Primary/Disabled
```

### 컴포넌트 속성 설정
**Button 컴포넌트 예시:**
```
- Size: Small(32px), Medium(40px), Large(48px)
- Type: Primary, Secondary, Ghost
- State: Default, Hover, Active, Disabled
- Icon: Boolean (true/false)
```

## 4. 아파트 커뮤니티 특화 컴포넌트

### 커뮤니티 카드
**Properties:**
```
- Type: Notice, Event, Poll, General
- Priority: High, Normal, Low
- Status: New, Hot, Closed
- Author Type: Admin, Resident, Anonymous
```

### 시설 예약 컴포넌트
**Properties:**
```
- Facility: Gym, Study Room, Party Room
- Time Slot: Available, Booked, Maintenance
- Date Picker: Calendar integration
```

## 5. 반응형 디자인 시스템

### 브레이크포인트
```
Mobile: 375px - 767px
Tablet: 768px - 1023px
Desktop: 1024px+
```

### 그리드 시스템
```
Mobile: 4 columns, 16px margins
Tablet: 8 columns, 24px margins
Desktop: 12 columns, 32px margins
```

## 6. 프로토타입 구성

### 주요 사용자 플로우
1. **온보딩**: 회원가입 → 아파트 인증 → 프로필 설정
2. **공지사항**: 홈 → 공지 목록 → 상세보기
3. **시설예약**: 시설 선택 → 날짜/시간 → 예약 확인
4. **커뮤니티**: 게시글 작성 → 발행 → 피드백

### 인터랙션 설정
```
Transition: Smart Animate (300ms ease-out)
Overlay: Modal (dim background)
Scroll: Vertical scrolling for feeds
Hover States: Desktop 전용
```

## 7. 개발자 핸드오프 가이드

### Figma Dev Mode 활용
1. **Inspect 패널**: CSS 속성 자동 생성
2. **Code Snippets**: React/Flutter 코드 제공
3. **Assets Export**: SVG, PNG 자동 추출

### 개발 문서 작성
```markdown
## Button Component Specs

### Props
- variant: 'primary' | 'secondary' | 'ghost'
- size: 'sm' | 'md' | 'lg'
- disabled: boolean
- icon?: ReactNode

### Styling
- Border radius: 8px
- Font weight: 600
- Transition: all 200ms ease
```

### 스타일 가이드 문서
```
Spacing Scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px
Shadow: 0 1px 3px rgba(0,0,0,0.1)
Border radius: 4px, 8px, 12px, 16px
Animation: 200ms ease-in-out
```

## 8. 품질 관리 체크리스트

### 디자인 일관성
- [ ] 모든 컴포넌트가 디자인 시스템 준수
- [ ] 컬러 사용이 정의된 팔레트 내에서만
- [ ] 타이포그래피 스케일 일관성
- [ ] 스페이싱 시스템 준수

### 접근성 검증
- [ ] 컬러 대비비 4.5:1 이상
- [ ] 터치 타겟 최소 44px
- [ ] 키보드 네비게이션 고려
- [ ] 스크린 리더 호환성

### 반응형 검증
- [ ] 모든 화면 크기에서 레이아웃 확인
- [ ] 터치 인터랙션 최적화
- [ ] 로딩 상태 디자인 포함

## 9. Figma 플러그인 추천

### 디자인 시스템 관리
- **Design Tokens**: 토큰 관리 및 동기화
- **Figma to Code**: 자동 코드 생성
- **Stark**: 접근성 검사

### 프로토타이핑
- **ProtoPie**: 고급 인터랙션
- **Principle**: 애니메이션 프로토타입
- **Overflow**: 사용자 플로우 다이어그램

### 에셋 관리
- **Unsplash**: 무료 이미지
- **Iconify**: 아이콘 라이브러리
- **Content Reel**: 더미 데이터 생성

## 10. 단계별 구현 계획

### Phase 1: 기초 설정 (1주)
1. Figma 파일 구조 생성
2. 디자인 토큰 정의
3. 기본 컴포넌트 5개 제작

### Phase 2: 컴포넌트 확장 (2주)
1. 아파트 특화 컴포넌트 제작
2. 반응형 변형 추가
3. 상태별 변형 완성

### Phase 3: 화면 디자인 (2주)
1. 주요 화면 4개 디자인
2. 프로토타입 연결
3. 사용성 테스트

### Phase 4: 개발 지원 (1주)
1. 개발자 문서 작성
2. 에셋 추출 및 정리
3. 핸드오프 미팅

## 11. 협업 워크플로우

### 디자이너 → 개발자
1. **디자인 완료** → Figma 링크 공유
2. **Dev Mode 활성화** → 개발자 접근 권한 부여
3. **스펙 문서 작성** → 상세 구현 가이드
4. **에셋 추출** → 이미지, 아이콘 파일 제공

### 피드백 수집
1. **Figma 댓글** → 실시간 피드백
2. **버전 관리** → 변경 사항 추적
3. **승인 프로세스** → 최종 검토 후 개발 진행

## 12. 유지보수 가이드

### 정기 업데이트
- **월 1회**: 컴포넌트 사용 현황 검토
- **분기 1회**: 디자인 시스템 개선
- **반기 1회**: 전체 리뉴얼 검토

### 버전 관리
```
v1.0: 초기 디자인 시스템
v1.1: 컴포넌트 추가/수정
v2.0: 메이저 업데이트
```

이 가이드를 따라 구현하면 개발팀과의 원활한 협업과 일관된 사용자 경험을 제공할 수 있습니다.
