# Figma Component Variant 생성 가이드

*작성일: 2025-10-17*

*작성자: Designer Agent*

*버전: v1.0*

## 1. 기본 버튼 컴포넌트 생성

### 1-1. 버튼 디자인 생성
1. **Rectangle 도구**로 버튼 배경 생성
2. **Text 도구**로 버튼 텍스트 추가
3. 두 요소를 선택 후 **Cmd + G** (그룹화)

### 1-2. 컴포넌트 생성
1. 그룹 선택 후 **Cmd + Alt + K** 또는
2. 우클릭 → "Create Component" 선택
3. 컴포넌트 이름을 "Button"으로 설정

## 2. Component Variant 설정

### 2-1. Variant 활성화
1. 생성된 컴포넌트 선택
2. 우측 Properties 패널에서 "+" 버튼 클릭
3. "Create component variant" 선택

### 2-2. Property 추가
1. Properties 패널에서 "Add property" 클릭
2. Property 이름: "State"
3. Type: "Variant" 선택
4. 첫 번째 값: "Default" 입력

## 3. 각 상태별 Variant 생성

### 3-1. 추가 상태 생성
1. 기존 Default 컴포넌트 복사 (**Cmd + D**)
2. Properties에서 State 값을 각각 변경:
   - "Hover"
   - "Pressed"
   - "Disabled"

### 3-2. 각 상태별 스타일 적용 (올바른 색상)

#### Primary Button - Default 상태:
```
배경색: #2B5CE6 (Primary Blue)
텍스트: #FFFFFF (흰색)
Border: 1px solid #2B5CE6
```

#### Primary Button - Hover 상태:
```
배경색: #1E4BD1 (진한 파란색)
텍스트: #FFFFFF
Border: 1px solid #1E4BD1
약간의 그림자 효과 추가
```

#### Primary Button - Pressed 상태:
```
배경색: #1A3FB8 (가장 진한 파란색)
텍스트: #FFFFFF
내부 그림자 또는 scale 0.98 적용
```

#### Primary Button - Disabled 상태:
```
배경색: #A8C5F0 (연한 파란색)
텍스트: #9E9E9E (회색)
투명도: 60%
```

#### Secondary Button - Default 상태:
```
배경색: #F8F9FA (연한 회색)
텍스트: #2B5CE6 (파란색)
Border: 1px solid #E9ECEF
```

#### Secondary Button - Hover 상태:
```
배경색: #E9ECEF (회색)
텍스트: #1E4BD1 (진한 파란색)
Border: 1px solid #DEE2E6
```

#### Outline Button:
```
배경색: transparent (투명)
텍스트: #2B5CE6 (파란색)
Border: 1px solid #2B5CE6
```

## 4. Variant 관리 및 정리

### 4-1. Property 값 정리
- Component 선택 시 우측에서 모든 variant 확인
- 각 variant의 이름과 순서 조정 가능

### 4-2. Auto Layout 적용 (권장)
1. 각 variant에 Auto Layout 적용 (**Shift + A**)
2. Padding: 12px (상하) × 24px (좌우)
3. 텍스트 길이에 따른 자동 크기 조정

## 5. 사용 방법

### 5-1. 인스턴스 생성
- Assets 패널에서 Button 컴포넌트 드래그
- 또는 **Cmd + Shift + O**로 검색 후 삽입

### 5-2. 상태 변경
1. 인스턴스 선택 후 우측 Properties에서
2. State 드롭다운으로 원하는 상태 선택

## 실제 구현 단계별 가이드

### Step 1: 기본 버튼 만들기 (올바른 색상)
```
1. Rectangle 도구 (R) 선택
2. 343 × 48px 크기로 그리기
3. Fill: #2B5CE6 (Primary Blue) 설정
4. Corner radius: 8px 설정
5. Text 도구 (T)로 "확인" 텍스트 추가
6. 텍스트 색상: #FFFFFF 설정
7. 두 요소 선택 후 Cmd + G로 그룹화
```

### Step 2: 컴포넌트로 변환
```
1. 그룹 선택
2. Cmd + Alt + K 누르기
3. 컴포넌트 이름: "Button" 입력
4. Enter로 확정
```

### Step 3: Variant 생성
```
1. 컴포넌트 선택
2. 우측 Properties 패널 확인
3. "+" 버튼 클릭
4. "Create component variant" 선택
5. 보라색 테두리로 변경됨 확인
```

### Step 4: Property 설정
```
1. Properties 패널에서 "Add property" 클릭
2. Property name: "State" 입력
3. Type: "Variant" 선택 (기본값)
4. Default value: "Default" 입력
5. "Create property" 클릭
```

### Step 5: 추가 상태 만들기 (올바른 색상)
```
1. Default variant 선택
2. Cmd + D로 복사
3. 새로운 variant의 Properties에서 State를 "Hover"로 변경
4. 배경색을 #1E4BD1 (진한 파란색)으로 변경
5. "Pressed" 상태: #1A3FB8 (가장 진한 파란색)
6. "Disabled" 상태: #A8C5F0 (연한 파란색), 텍스트 #9E9E9E
```

## 아파트 커뮤니티 전용 컴포넌트 (올바른 색상)

### Card Component Variants
```
Default Card:
- 배경: #FFFFFF
- 테두리: 1px solid #E9ECEF
- 그림자: 0 2px 4px rgba(43, 92, 230, 0.08)

Primary Card (중요 공지용):
- 좌측 테두리: 4px solid #2B5CE6
- 배경: #F8F9FF (매우 연한 파란색)

Secondary Card:
- 배경: #F8F9FA (연한 회색)
- 테두리: 1px solid #E9ECEF
```

### Input Field Variants
```
Default:
- 테두리: 1px solid #DEE2E6

Focus:
- 테두리: #2B5CE6
- 그림자: 0 0 0 2px rgba(43, 92, 230, 0.1)

Error:
- 테두리: #DC3545 (빨간색)
```

### Navigation Variants
```
Active Tab:
- 색상: #2B5CE6
- 하단 테두리: 2px solid #2B5CE6

Hover:
- 색상: #2B5CE6
- 배경: #F8F9FA
```

## 고급 기능

### Multiple Properties
```
Size Property 추가:
1. "Add property" 클릭
2. Name: "Size"
3. Type: "Variant"
4. Values: "Small", "Medium", "Large"

결과: State × Size = 12개 조합 생성
```

### Boolean Properties
```
Icon Property 추가:
1. "Add property" 클릭
2. Name: "Icon"
3. Type: "Boolean"
4. Default: false

사용법: 체크박스로 아이콘 표시/숨김
```

### Interactive Components
```
프로토타입 설정:
1. Prototype 탭 선택
2. Default 상태에서 Hover로 드래그
3. Trigger: "Mouse enter"
4. Action: "Change to"
5. Destination: "Hover" variant
```

## 실무 팁

### 1. 네이밍 컨벤션
```
좋은 예:
- Button/Primary/Default
- Button/Secondary/Hover
- Input/Text/Focus

나쁜 예:
- 버튼1
- button_hover
- btn-disabled
```

### 2. 색상 관리
```
Color Styles 사용:
1. Fill 색상 선택
2. 우측 "+" 버튼 클릭
3. "Create style" 선택
4. 이름: "Primary/500" 입력

장점: 전체 디자인 시스템에서 일관된 색상 관리
```

### 3. 텍스트 스타일
```
Text Styles 생성:
1. 텍스트 선택
2. Text 패널에서 "+" 클릭
3. 이름: "Button/Medium" 입력

적용: 모든 버튼에서 동일한 텍스트 스타일 사용
```

### 4. 성능 최적화
```
- 불필요한 variant 제거
- 복잡한 그래픽 대신 단순한 도형 사용
- 과도한 그림자/효과 지양
- Auto Layout으로 반응형 구조 구축
```

## 문제 해결

### Q: Variant가 생성되지 않아요
**A:** 컴포넌트가 먼저 생성되어야 합니다. Cmd + Alt + K로 컴포넌트 생성 후 시도하세요.

### Q: Property가 적용되지 않아요
**A:** 인스턴스가 아닌 마스터 컴포넌트를 수정해야 합니다. Assets 패널에서 컴포넌트를 찾아 수정하세요.

### Q: 상태 변경이 안 돼요
**A:** 인스턴스를 선택하고 우측 Properties 패널에서 변경해야 합니다. 마스터 컴포넌트에서는 변경되지 않습니다.

### Q: 너무 많은 variant가 생겼어요
**A:** Properties를 줄이거나 Boolean type을 활용하여 조합 수를 줄이세요.

## 추가 팁

- **Interactive Components**: Prototype 탭에서 각 상태 간 전환 애니메이션 설정 가능
- **Boolean Property**: 추가로 Size (Small/Large) 등의 속성도 함께 관리 가능
- **Documentation**: 각 variant에 설명 추가로 팀원들과 사용법 공유

이렇게 설정하면 일관된 버튼 디자인을 유지하면서 다양한 상태를 효율적으로 관리할 수 있습니다.
