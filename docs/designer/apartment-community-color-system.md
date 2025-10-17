# 아파트 커뮤니티 색상 시스템

*작성일: 2025-10-17*  
*작성자: Designer Agent*  
*버전: v1.0*

## 기본 색상 팔레트 (수정됨)

### Primary Colors (주요 색상 - 파란색 계열)
```css
--primary-50: #EBF2FF;
--primary-100: #D6E4FF;
--primary-200: #B3CCFF;
--primary-300: #80A9FF;
--primary-400: #4D7FFF;
--primary-500: #2B5CE6; /* 메인 브랜드 색상 */
--primary-600: #1E4BD1;
--primary-700: #1A3FB8;
--primary-800: #16349E;
--primary-900: #122985;
```

### Secondary Colors (보조 색상 - 회색 계열)
```css
--secondary-50: #F8F9FA; /* 메인 Secondary 색상 */
--secondary-100: #E9ECEF;
--secondary-200: #DEE2E6;
--secondary-300: #CED4DA;
--secondary-400: #ADB5BD;
--secondary-500: #6C757D;
--secondary-600: #495057;
--secondary-700: #343A40;
--secondary-800: #212529;
--secondary-900: #000000;
```

### Accent Colors (강조 색상)
```css
--accent-50: #FFF3E0;
--accent-100: #FFE0B2;
--accent-200: #FFCC80;
--accent-300: #FFB74D;
--accent-400: #FFA726;
--accent-500: #FF6B35; /* 주목도 높은 오렌지 */
--accent-600: #E55722;
--accent-700: #D84315;
```

## Button Component CSS

### Primary Button
```css
.btn-primary {
  background-color: var(--primary-500);
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 200ms ease;
}

.btn-primary:hover {
  background-color: var(--primary-600);
  box-shadow: 0 2px 8px rgba(46, 125, 50, 0.2);
}

.btn-primary:active {
  background-color: var(--primary-700);
  transform: scale(0.98);
}

.btn-primary:disabled {
  background-color: var(--primary-200);
  color: #9E9E9E;
  cursor: not-allowed;
}
```

### Secondary Button
```css
.btn-secondary {
  background-color: transparent;
  color: var(--primary-500);
  border: 1px solid var(--primary-500);
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 200ms ease;
}

.btn-secondary:hover {
  background-color: var(--primary-50);
  border-color: var(--primary-600);
  color: var(--primary-600);
}

.btn-secondary:active {
  background-color: var(--primary-100);
}
```

### Accent Button (긴급/중요 액션용)
```css
.btn-accent {
  background-color: var(--accent-500);
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
}

.btn-accent:hover {
  background-color: var(--accent-600);
}
```

## Card Component CSS

### Default Card
```css
.card {
  background-color: #FFFFFF;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(46, 125, 50, 0.08);
  padding: 16px;
  transition: box-shadow 200ms ease;
}

.card:hover {
  box-shadow: 0 4px 8px rgba(46, 125, 50, 0.12);
}
```

### Featured Card (공지사항용)
```css
.card-featured {
  background-color: var(--primary-50);
  border-left: 4px solid var(--primary-500);
  border-radius: 8px;
  padding: 16px;
}
```

### Urgent Card (긴급 공지용)
```css
.card-urgent {
  background-color: #FFEBEE;
  border-left: 4px solid #D32F2F;
  border-radius: 8px;
  padding: 16px;
}
```

## Input Component CSS

### Default Input
```css
.input {
  border: 1px solid #BDBDBD;
  border-radius: 4px;
  padding: 12px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: var(--primary-500);
  box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.2);
  outline: none;
}

.input.error {
  border-color: #D32F2F;
}

.input.error:focus {
  box-shadow: 0 0 0 2px rgba(211, 47, 47, 0.2);
}
```

## Badge/Tag Component CSS

### Status Badges
```css
.badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.badge-active {
  background-color: var(--primary-100);
  color: var(--primary-700);
}

.badge-pending {
  background-color: #FFF3E0;
  color: #E65100;
}

.badge-urgent {
  background-color: #FFEBEE;
  color: #C62828;
}

.badge-completed {
  background-color: #E8F5E8;
  color: #1B5E20;
}
```

## Navigation Component CSS

### Tab Navigation
```css
.nav-tab {
  padding: 12px 16px;
  color: #757575;
  border-bottom: 2px solid transparent;
  transition: all 200ms ease;
}

.nav-tab:hover {
  color: var(--primary-500);
}

.nav-tab.active {
  color: var(--primary-500);
  border-bottom-color: var(--primary-500);
}
```

### Side Navigation
```css
.nav-item {
  padding: 12px 16px;
  color: #424242;
  border-radius: 8px;
  transition: all 200ms ease;
}

.nav-item:hover {
  background-color: var(--primary-50);
  color: var(--primary-600);
}

.nav-item.active {
  background-color: var(--primary-100);
  color: var(--primary-700);
  border-left: 3px solid var(--primary-500);
}
```

## Alert Component CSS

### Success Alert
```css
.alert-success {
  background-color: #E8F5E8;
  border: 1px solid var(--primary-200);
  color: var(--primary-700);
  padding: 12px 16px;
  border-radius: 8px;
}
```

### Warning Alert
```css
.alert-warning {
  background-color: #FFF3E0;
  border: 1px solid #FFCC80;
  color: #E65100;
  padding: 12px 16px;
  border-radius: 8px;
}
```

### Error Alert
```css
.alert-error {
  background-color: #FFEBEE;
  border: 1px solid #FFCDD2;
  color: #C62828;
  padding: 12px 16px;
  border-radius: 8px;
}
```

## 색상 사용 가이드라인

### 주요 원칙
1. **Primary Green (#2E7D32)**: 메인 액션, 브랜드 요소
2. **Secondary Blue (#1976D2)**: 보조 액션, 링크
3. **Accent Orange (#FF6B35)**: 긴급, 중요 알림
4. **Neutral Grays**: 텍스트, 배경, 구분선

### 접근성 고려사항
- 모든 텍스트는 배경 대비 4.5:1 이상 유지
- 색상에만 의존하지 않고 아이콘, 텍스트로 보완
- 색맹 사용자를 위한 패턴/모양 구분 제공

### 사용 예시
```css
/* 성공 메시지 */
.success { color: var(--primary-600); }

/* 경고 메시지 */
.warning { color: #E65100; }

/* 오류 메시지 */
.error { color: #D32F2F; }

/* 정보 메시지 */
.info { color: var(--secondary-600); }
```

이 색상 시스템은 아파트 커뮤니티의 신뢰감과 안정감을 강조하면서도 명확한 시각적 위계를 제공합니다.
