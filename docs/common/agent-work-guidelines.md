# 에이전트 작업 가이드라인

*작성일: 2025-10-17*

*중요도: 필수*

## 🚨 중요 공지

**모든 에이전트는 작업 전에 반드시 기존 문서를 확인해야 합니다.**

## 📋 작업 전 필수 체크리스트

### 1. 기존 문서 확인 순서
1. **docs/README.md** - 전체 문서 목록 확인
2. **관련 기능 문서** - 작업하려는 기능의 기존 명세 확인
3. **디자인 가이드라인** - 색상, 타이포그래피, 컴포넌트 규칙 확인
4. **PRD** - 전체 제품 요구사항 이해

### 2. 색상 시스템 (절대 변경 금지)
```
Primary: #2B5CE6 (파란색)
Secondary: #F8F9FA (연한 회색)
```

### 3. 기존 결정사항 존중
- 이미 정의된 기능 명세는 함부로 변경하지 않음
- 색상, 타이포그래피 등 디자인 시스템 준수
- 기존 아키텍처 결정사항 고려

## 📁 주요 참조 문서

### PM Agent 필수 참조
- `PRD-apartment-community-platform.md`
- `community-features-analysis.md`
- `parking-features-spec.md`
- `partner-service-business-model.md`

### Designer Agent 필수 참조
- `wireframes-and-design-guidelines.md`
- `figma-design-system-guide.md`
- `apartment-community-color-system.md`

### Developer Agent 필수 참조
- `PRD-apartment-community-platform.md`
- `user-flow-and-menu-structure.md`
- `wireframes-and-design-guidelines.md`

### Infrastructure Agent 필수 참조
- `PRD-apartment-community-platform.md`
- 모든 기능 명세서 (확장성 고려)

## ⚠️ 금지사항

1. **기존 색상 시스템 임의 변경**
2. **이미 정의된 기능 명세 무시**
3. **문서 확인 없이 새로운 방향 제시**
4. **기존 결정사항과 상충되는 제안**

## ✅ 권장사항

1. **작업 시작 전 관련 문서 전체 읽기**
2. **기존 결정사항에 대한 이유 이해**
3. **일관성 있는 제안**
4. **기존 시스템과의 호환성 고려**

## 🔄 작업 프로세스

```
1. 요청 접수
   ↓
2. 관련 문서 확인 (필수)
   ↓
3. 기존 결정사항 파악
   ↓
4. 일관성 있는 제안 작성
   ↓
5. 기존 시스템과의 호환성 검증
```

## 📞 문의사항

기존 문서와 상충되는 요청이나 불명확한 사항이 있을 경우:
1. 기존 문서의 해당 부분 인용
2. 상충되는 부분 명시
3. 명확한 확인 요청

**예시:**
> "기존 wireframes-and-design-guidelines.md에서 Primary 색상이 #2B5CE6로 정의되어 있습니다. 새로운 요청과 다른 부분이 있어 확인이 필요합니다."

이 가이드라인을 준수하여 일관성 있고 품질 높은 작업 결과를 만들어주세요.
