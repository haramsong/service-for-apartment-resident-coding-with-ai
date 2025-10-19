# PM 검토 내용 기반 디자인 개선안

**작성일**: 2025-10-19  
**작성자**: Designer Agent  
**이슈 유형**: PM 검토 반영  
**우선순위**: High  

## 📋 PM 검토 요청 배경

PM Agent의 홈페이지 현재 상태 검토 결과를 바탕으로 PRD 요구사항과 일치하는 디자인 개선안을 제시하여 사용자 경험을 향상시키고자 함.

## 🔍 PM 검토 핵심 이슈 분석

### 1. 빠른 액션 메뉴 확장 필요
**현재**: 4개 메뉴 (커뮤니티, 주차현황, 택배, 일정)  
**PRD 요구**: 8개 메뉴 (민원신청, 시설예약, 관리비조회, 알림 추가)

### 2. 네비게이션 구조 불일치
**현재**: [홈] [커뮤니티] [생활] [더보기] (4개)  
**PRD 요구**: [홈] [커뮤니티] [생활] [예약] [MY] (5개)

### 3. 개인화 시스템 부재
**현재**: 고정된 더미 데이터  
**개선**: 실제 사용자 정보 연동

## 🎨 디자인 개선안

### 1. 빠른 액션 메뉴 확장 디자인

#### A. 레이아웃 구조 변경
```css
/* 현재: 2x2 그리드 */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 16px;
}

/* 개선: 4x2 그리드 (8개 메뉴) */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 12px;
  padding: 16px;
}

/* 모바일 최적화 */
@media (max-width: 768px) {
  .quick-actions {
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    padding: 12px;
  }
}
```

#### B. 메뉴 아이템 크기 조정
```css
.quick-action-item {
  /* 기존 크기 유지하되 간격 최적화 */
  min-height: 80px;
  padding: 12px 8px;
  border-radius: 12px;
  
  /* 터치 영역 확보 */
  min-width: 44px;
  
  /* 텍스트 크기 조정 */
  font-size: 12px;
  line-height: 1.2;
}

.quick-action-icon {
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
}
```

#### C. 우선순위 기반 메뉴 배치
```typescript
const quickActionsLayout = [
  // 첫 번째 줄 (핵심 기능)
  { icon: MessageSquare, title: '커뮤니티', href: '/community', priority: 1 },
  { icon: FileText, title: '민원신청', href: '/life/complaint', priority: 2 },
  { icon: Car, title: '주차현황', href: '/life/parking', priority: 3 },
  { icon: CalendarCheck, title: '시설예약', href: '/reservation', priority: 4 },
  
  // 두 번째 줄 (생활 편의)
  { icon: Package, title: '택배', href: '/life/delivery', priority: 5 },
  { icon: CreditCard, title: '관리비', href: '/life/management-fee', priority: 6 },
  { icon: Calendar, title: '일정', href: '/life/schedule', priority: 7 },
  { icon: Bell, title: '알림', href: '/notifications', priority: 8 }
]
```

### 2. 네비게이션 구조 개선

#### A. Bottom Navigation 확장
```typescript
const navigationItems = [
  {
    name: '홈',
    href: '/',
    icon: Home,
    activeIcon: HomeFilled
  },
  {
    name: '커뮤니티',
    href: '/community',
    icon: MessageSquare,
    activeIcon: MessageSquareFilled,
    badge: true // 새 글 알림
  },
  {
    name: '생활',
    href: '/life',
    icon: Building,
    activeIcon: BuildingFilled
  },
  {
    name: '예약', // 새로 추가
    href: '/reservation',
    icon: CalendarCheck,
    activeIcon: CalendarCheckFilled
  },
  {
    name: 'MY', // 더보기 → MY로 변경
    href: '/my',
    icon: User,
    activeIcon: UserFilled
  }
]
```

#### B. 네비게이션 스타일 개선
```css
.bottom-navigation {
  /* 기존 스타일 유지하되 5개 아이템 대응 */
  display: flex;
  justify-content: space-around;
  padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
  
  /* 아이템 간격 조정 */
  gap: 4px;
}

.nav-item {
  /* 5개 아이템에 맞춰 크기 조정 */
  flex: 1;
  max-width: 64px;
  min-width: 48px;
  
  /* 텍스트 크기 조정 */
  font-size: 10px;
  line-height: 1.2;
}

.nav-icon {
  width: 20px;
  height: 20px;
  margin-bottom: 2px;
}
```

### 3. 개인화 헤더 디자인

#### A. 동적 사용자 정보 표시
```typescript
interface UserHeaderProps {
  user: {
    name: string;
    apartment: string;
    unit: string;
    profileImage?: string;
  };
  notifications: number;
}

const UserHeader: React.FC<UserHeaderProps> = ({ user, notifications }) => (
  <header className="user-header">
    <div className="user-info">
      <div className="user-avatar">
        {user.profileImage ? (
          <img src={user.profileImage} alt={`${user.name} 프로필`} />
        ) : (
          <div className="avatar-placeholder">
            {user.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="user-details">
        <h1 className="user-greeting">
          {user.apartment} {user.unit}
        </h1>
        <p className="user-name">{user.name}님, 안녕하세요!</p>
      </div>
    </div>
    <div className="header-actions">
      <button className="notification-button" aria-label={`알림 ${notifications}개`}>
        <Bell size={24} />
        {notifications > 0 && (
          <span className="notification-badge">{notifications}</span>
        )}
      </button>
      <button className="settings-button" aria-label="설정">
        <Settings size={24} />
      </button>
    </div>
  </header>
);
```

#### B. 헤더 스타일 개선
```css
.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, #2E7D32 0%, #388E3C 100%);
  color: white;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
}

.user-greeting {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  opacity: 0.9;
}

.user-name {
  font-size: 14px;
  margin: 2px 0 0 0;
  opacity: 0.8;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.notification-button,
.settings-button {
  position: relative;
  padding: 8px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.notification-button:hover,
.settings-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.notification-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: #FF6B35;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
```

### 4. 반응형 디자인 최적화

#### A. 모바일 우선 접근법
```css
/* 모바일 (기본) */
.quick-actions {
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 12px;
}

.quick-action-item {
  min-height: 72px;
  padding: 8px 4px;
}

.quick-action-icon {
  width: 20px;
  height: 20px;
}

/* 태블릿 */
@media (min-width: 768px) {
  .quick-actions {
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    padding: 16px;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .quick-action-item {
    min-height: 80px;
    padding: 12px 8px;
  }
  
  .quick-action-icon {
    width: 24px;
    height: 24px;
  }
}

/* 데스크톱 */
@media (min-width: 1024px) {
  .quick-actions {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    padding: 20px;
    max-width: 800px;
  }
  
  .quick-action-item {
    min-height: 88px;
    padding: 16px 12px;
  }
  
  .quick-action-icon {
    width: 28px;
    height: 28px;
  }
}
```

### 5. 접근성 개선

#### A. ARIA 라벨 및 키보드 네비게이션
```typescript
const QuickActionItem = ({ action, index }) => (
  <button
    className="quick-action-item"
    onClick={() => navigate(action.href)}
    aria-label={`${action.title} 페이지로 이동`}
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navigate(action.href);
      }
    }}
  >
    <action.icon 
      className="quick-action-icon" 
      aria-hidden="true"
    />
    <span className="quick-action-title">{action.title}</span>
    {action.badge && (
      <span 
        className="action-badge"
        aria-label={`새 알림 ${action.badge}개`}
      >
        {action.badge}
      </span>
    )}
  </button>
);
```

#### B. 색상 대비 및 시각적 피드백
```css
.quick-action-item {
  /* 충분한 색상 대비 확보 */
  background: #ffffff;
  color: #212121;
  border: 1px solid #e0e0e0;
  
  /* 포커스 상태 */
  &:focus {
    outline: 2px solid #2E7D32;
    outline-offset: 2px;
  }
  
  /* 호버 상태 */
  &:hover {
    background: #f5f5f5;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  /* 활성 상태 */
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}

/* 고대비 모드 지원 */
@media (prefers-contrast: high) {
  .quick-action-item {
    border: 2px solid #000000;
    background: #ffffff;
    color: #000000;
  }
  
  .quick-action-item:hover {
    background: #f0f0f0;
  }
}

/* 다크 모드 지원 */
@media (prefers-color-scheme: dark) {
  .quick-action-item {
    background: #2d2d2d;
    color: #ffffff;
    border-color: #404040;
  }
  
  .quick-action-item:hover {
    background: #3d3d3d;
  }
}
```

## 🎯 구현 우선순위

### Phase 1: 즉시 구현 (이번 주)
1. **빠른 액션 메뉴 확장**: 4개 → 8개 메뉴
2. **네비게이션 구조 변경**: 5개 탭 구조
3. **반응형 레이아웃 조정**: 8개 메뉴 대응

### Phase 2: 단기 구현 (2주 내)
1. **개인화 헤더**: 동적 사용자 정보 표시
2. **접근성 강화**: ARIA 라벨, 키보드 네비게이션
3. **시각적 피드백 개선**: 애니메이션, 상태 표시

### Phase 3: 중장기 구현 (1개월 내)
1. **다크 모드 지원**: 사용자 선택 옵션
2. **고급 접근성**: 음성 안내, 고대비 모드
3. **개인화 메뉴**: 사용자별 메뉴 순서 조정

## 📊 디자인 시스템 업데이트

### 1. 컴포넌트 라이브러리 확장
```typescript
// QuickActionGrid 컴포넌트
interface QuickActionGridProps {
  actions: QuickAction[];
  columns?: 2 | 4;
  variant?: 'default' | 'compact';
}

// NavigationBar 컴포넌트  
interface NavigationBarProps {
  items: NavigationItem[];
  currentPath: string;
  variant?: 'bottom' | 'side';
}

// UserHeader 컴포넌트
interface UserHeaderProps {
  user: UserInfo;
  notifications: number;
  onNotificationClick: () => void;
  onSettingsClick: () => void;
}
```

### 2. 토큰 시스템 업데이트
```css
:root {
  /* 기존 토큰 유지 */
  --color-primary: #2E7D32;
  --color-secondary: #1976D2;
  --color-accent: #FF6B35;
  
  /* 새로운 토큰 추가 */
  --grid-columns-mobile: 4;
  --grid-columns-tablet: 4;
  --grid-columns-desktop: 4;
  
  --nav-items-count: 5;
  --nav-item-min-width: 48px;
  --nav-item-max-width: 64px;
  
  /* 간격 시스템 확장 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 20px;
  --spacing-2xl: 24px;
}
```

## 🔧 개발자 협업 가이드

### 1. 컴포넌트 구현 순서
1. **QuickActionGrid**: 8개 메뉴 레이아웃
2. **NavigationBar**: 5개 탭 구조
3. **UserHeader**: 개인화 헤더
4. **ResponsiveLayout**: 반응형 컨테이너

### 2. API 연동 포인트
```typescript
// 사용자 정보 API
interface UserAPI {
  getCurrentUser(): Promise<UserInfo>;
  getNotificationCount(): Promise<number>;
}

// 빠른 액션 설정 API
interface QuickActionAPI {
  getUserPreferences(): Promise<QuickActionPreference[]>;
  updatePreferences(prefs: QuickActionPreference[]): Promise<void>;
}
```

### 3. 상태 관리 구조
```typescript
interface AppState {
  user: {
    info: UserInfo | null;
    notifications: number;
    preferences: UserPreferences;
  };
  navigation: {
    currentPath: string;
    history: string[];
  };
  quickActions: {
    items: QuickAction[];
    layout: 'grid' | 'list';
    customOrder: number[];
  };
}
```

## 📈 성공 지표

### 정량적 지표
- **메뉴 사용률**: 각 빠른 액션 클릭률 측정
- **네비게이션 효율성**: 목표 페이지 도달 시간
- **접근성 점수**: Lighthouse 접근성 점수 90+ 목표

### 정성적 지표
- **사용자 피드백**: "원하는 기능을 쉽게 찾을 수 있다"
- **직관성**: 신규 사용자 온보딩 완료율
- **일관성**: 디자인 시스템 준수율

## 🚀 다음 단계

### 즉시 실행
1. **Developer Agent와 협의**: 컴포넌트 구현 방안 논의
2. **빠른 액션 메뉴 확장**: 8개 메뉴 레이아웃 구현
3. **네비게이션 구조 변경**: 5개 탭 구조 적용

### 단기 계획
1. **사용자 테스트**: 변경된 구조의 사용성 검증
2. **접근성 검증**: 스크린 리더, 키보드 네비게이션 테스트
3. **성능 최적화**: 렌더링 성능 및 로딩 시간 개선

### 중장기 계획
1. **개인화 시스템**: 사용자별 메뉴 커스터마이징
2. **고급 기능**: 다크 모드, 고대비 모드 지원
3. **확장성**: 다른 페이지 디자인 시스템 적용

이 디자인 개선안을 통해 PM 검토에서 제기된 모든 이슈를 해결하고, PRD 요구사항에 부합하는 사용자 경험을 제공할 수 있을 것입니다.
