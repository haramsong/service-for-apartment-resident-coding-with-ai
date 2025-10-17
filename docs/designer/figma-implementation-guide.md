# 아파트 커뮤니티 앱 Figma 디자인 구현 가이드

*작성일: 2025-10-16*  
*작성자: Designer Agent*  
*버전: v1.0*

## 1단계: Figma 프로젝트 설정

### 새 프로젝트 생성
1. Figma 접속 → "New design file" 클릭
2. 파일명: "아파트 커뮤니티 앱"
3. Frame 생성: iPhone 14 Pro (393 × 852px) 선택

### 디자인 시스템 준비
**컬러 팔레트 설정:**
```
- Primary: #2B5CE6 (메인 블루)
- Secondary: #F8F9FA (배경 그레이)
- Text Primary: #1A1A1A
- Text Secondary: #6B7280
- Success: #10B981
- Warning: #F59E0B
- Error: #EF4444
```

## 2단계: 기본 컴포넌트 제작

### 2-1. 타이포그래피 스타일 생성
1. Text tool (T) 선택
2. 텍스트 스타일 생성:
   - **H1**: Pretendard Bold 24px
   - **H2**: Pretendard SemiBold 20px
   - **Body**: Pretendard Regular 16px
   - **Caption**: Pretendard Regular 14px

### 2-2. 버튼 컴포넌트
1. Rectangle 생성 (343 × 48px)
2. Corner radius: 8px
3. Fill: Primary 컬러
4. 텍스트 추가 → "확인" 입력
5. 우클릭 → "Create component" (⌘K)
6. 이름: "Button/Primary"

### 2-3. 입력 필드 컴포넌트
1. Rectangle 생성 (343 × 48px)
2. Fill: #FFFFFF, Stroke: #E5E7EB 1px
3. Corner radius: 8px
4. Placeholder 텍스트 추가
5. Component 생성: "Input/Default"

## 3단계: 홈 화면 디자인

### 3-1. 상단 헤더 영역
**구성 요소:**
```
- 아파트명 (좌측): H2 스타일
- 알림 아이콘 (우측): 24×24px
- 배경: #FFFFFF
- 하단 구분선: #F3F4F6 1px
```

**구현 단계:**
1. Rectangle (393 × 88px) 생성
2. 아파트명 텍스트 추가 (좌측 16px 여백)
3. 알림 아이콘 배치 (우측 16px 여백)
4. Component 생성: "Header/Home"

### 3-2. 퀵 메뉴 카드
1. Rectangle (343 × 120px) 생성
2. Fill: #FFFFFF, Shadow: 0 2px 8px rgba(0,0,0,0.1)
3. Corner radius: 12px
4. 내부에 4개 아이콘 배치 (2×2 그리드)
5. 각 아이콘 하단에 라벨 텍스트
6. Component 생성: "Card/QuickMenu"

### 3-3. 공지사항 섹션
1. 섹션 제목: "공지사항" (H2 스타일)
2. 공지 아이템 컴포넌트:
   - Rectangle (343 × 72px)
   - 제목, 날짜, 중요도 표시
   - Component: "ListItem/Notice"

## 4단계: 네비게이션 구현

### 하단 탭바 제작
1. Rectangle (393 × 83px) 생성
2. Fill: #FFFFFF, 상단 구분선 추가
3. 5개 탭 아이콘 균등 배치
4. 선택/비선택 상태 Variant 생성
5. Component: "TabBar/Bottom"

## 5단계: 반응형 및 상태 관리

### Auto Layout 적용
1. 모든 컴포넌트에 Auto Layout 설정
2. Padding과 Gap 값 일관성 유지
3. Resizing 규칙 설정 (Fill container)

### Component Variants 생성
**버튼 상태:**
- Default, Hover, Pressed, Disabled

**입력 필드 상태:**
- Default, Focus, Error, Disabled

## 6단계: 프로토타이핑

### 인터랙션 연결
1. 홈 화면 → 각 메뉴 화면 연결
2. Transition: Smart animate
3. Duration: 300ms
4. Easing: Ease out

### 사용성 테스트 준비
1. Present 모드로 플로우 확인
2. 터치 영역 44px 이상 확보
3. 색상 대비 4.5:1 이상 유지

## 7단계: 디자인 시스템 정리

### 스타일 가이드 페이지 생성
1. 새 페이지: "Design System"
2. 컬러, 타이포그래피, 컴포넌트 정리
3. 사용 가이드라인 문서화

### 개발 전달 준비
1. Inspect 패널에서 CSS 코드 확인
2. Assets 패널에서 아이콘 Export
3. 개발자와 공유 설정

## 상세 컴포넌트 구현 가이드

### 커뮤니티 카드 컴포넌트
```
크기: 343 × 120px
배경: #FFFFFF
그림자: 0 2px 8px rgba(0,0,0,0.1)
모서리: 12px 둥글게

내부 구성:
- 제목 (16px, SemiBold)
- 작성자 (14px, Regular, #6B7280)
- 시간 (12px, Regular, #9CA3AF)
- 댓글/좋아요 아이콘 (우측 하단)
```

### 시설 예약 카드
```
크기: 343 × 100px
배경: #F8F9FA (예약 불가시 #FEF2F2)
테두리: 1px solid #E5E7EB

내부 구성:
- 시설 아이콘 (좌측, 40×40px)
- 시설명 (16px, SemiBold)
- 운영시간 (14px, Regular)
- 예약 상태 버튼 (우측)
```

### 민원 신청 폼
```
입력 필드 스타일:
- 높이: 48px
- 테두리: 1px solid #D1D5DB
- 포커스: 2px solid #2B5CE6
- 에러: 2px solid #EF4444
- 내부 여백: 12px

드롭다운 스타일:
- 화살표 아이콘: 우측 12px
- 옵션 리스트: 최대 높이 200px
- 선택된 항목: #EBF4FF 배경
```

## 아이콘 가이드

### 필수 아이콘 목록
```
홈: house-fill
커뮤니티: chat-bubble-left-right
생활: clipboard-document-list
예약: calendar
MY: user-circle

알림: bell
설정: cog-6-tooth
검색: magnifying-glass
더보기: ellipsis-horizontal
```

### 아이콘 규격
- 크기: 24×24px (기본), 20×20px (작은 버튼)
- 스타일: Outline (기본), Fill (선택 상태)
- 색상: #374151 (기본), #2B5CE6 (활성)

## 색상 사용 가이드

### 상태별 색상
```
성공: #10B981 (예약 완료, 처리 완료)
경고: #F59E0B (대기 중, 주의 필요)
오류: #EF4444 (실패, 긴급)
정보: #3B82F6 (일반 정보, 안내)
```

### 배경 색상
```
기본 배경: #F8F9FA
카드 배경: #FFFFFF
선택된 항목: #EBF4FF
비활성화: #F3F4F6
```

## 체크리스트

### 디자인 완성도 확인
- [ ] 모든 화면이 393×852px 프레임 내에 구성
- [ ] 컴포넌트가 일관된 스타일 적용
- [ ] 터치 영역이 44px 이상 확보
- [ ] 텍스트 대비비가 4.5:1 이상
- [ ] Auto Layout이 모든 컴포넌트에 적용

### 프로토타입 확인
- [ ] 주요 사용자 플로우 연결 완료
- [ ] 인터랙션 애니메이션 자연스러움
- [ ] 모든 버튼과 링크 동작 확인
- [ ] 에러 상태 화면 포함
- [ ] 로딩 상태 디자인 포함

### 개발 전달 준비
- [ ] 모든 컴포넌트 명명 규칙 준수
- [ ] 스타일 가이드 문서 완성
- [ ] 에셋 파일 정리 및 Export
- [ ] 개발자 공유 권한 설정
- [ ] Inspect 모드에서 CSS 확인

이 가이드를 따라 단계별로 진행하면 일관성 있고 사용자 친화적인 아파트 커뮤니티 앱 디자인을 완성할 수 있습니다.
