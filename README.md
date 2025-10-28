# 아파트 커뮤니티 플랫폼 "우리동네"

아파트 입주민을 위한 종합 커뮤니티 및 생활 편의 서비스 플랫폼

## 프로젝트 개요

- **비전**: 아파트 생활의 모든 것을 연결하는 스마트 커뮤니티 플랫폼
- **개발 시작일**: 2025-10-16
- **개발자**: songharam
- **현재 상태**: 요구사항 분석 및 PRD 완료

## 핵심 기능

### 1단계 (MVP - 3개월)

- ✅ 기본 커뮤니티 (공지사항, 자유게시판)
- ✅ 관리사무소 연동 (민원, 관리비 조회, 시설 예약)
- ✅ 기본 생활 서비스 (택배 알림, 주차 현황)

### 2단계 (확장 - 6개월)

- 🔄 제휴 업체 서비스 (수리, 청소, 배달)
- 🔄 고급 커뮤니티 기능 (소모임, 이벤트)
- 🔄 스마트 기능 (주차 예약, AI 챗봇)

### 3단계 (고도화 - 12개월)

- ⏳ 소셜 커머스 (공동구매, 재능 마켓플레이스)
- ⏳ 데이터 기반 서비스 (개인화 추천)
- ⏳ 확장 서비스 (금융 연동, 다중 아파트)

## 비즈니스 모델

### 수익 구조

1. **구독료**: 입주민 월 구독 (1,000원 → 3,000원)
2. **제휴 수수료**: 업체 거래 시 3-5% 수수료
3. **광고 수익**: 업체 프리미엄 리스팅, 배너 광고
4. **소셜 커머스**: 공동구매, 중고거래 수수료

### 예상 수익 (300세대 기준)

- **3개월 후**: 35만원/월
- **6개월 후**: 130만원/월
- **12개월 후**: 260만원/월

## 프로젝트 구조

```
apartment-community/
├── README.md           # 프로젝트 개요 (현재 파일)
├── .gitignore         # Git 무시 파일
├── docs/              # 문서 디렉토리
│   ├── PRD-apartment-community-platform.md    # 최종 PRD
│   ├── community-features-analysis.md          # 커뮤니티 기능 분석
│   ├── parking-features-spec.md                # 주차 기능 명세
│   ├── partner-service-business-model.md       # 제휴 업체 BM 분석
│   └── project-plan.md                         # 프로젝트 계획서
├── src/               # 소스 코드 디렉토리
├── tests/             # 테스트 디렉토리
└── config/            # 설정 파일 디렉토리

.amazonq/cli-agents/   # Q CLI 에이전트 설정
├── pm-agent.json              # PM 에이전트
├── developer-agent.json       # 개발자 에이전트
├── designer-agent.json        # 디자이너 에이전트
└── devops-agent.json          # DevOps 에이전트
```

## 개발 진행 상황

- [x] 프로젝트 초기 설정
- [x] 요구사항 분석 완료
- [x] 비즈니스 모델 설계 완료
- [x] PRD (Product Requirements Document) 작성 완료
- [x] 전문 에이전트 구성 완료 (PM, Developer, Designer, Infrastructure)
- [x] 기술 스택 선정
- [x] 아키텍처 설계
- [ ] MVP 개발 시작

## 차별화 포인트

1. **실시간 알림 시스템** - 긴급 상황, 택배 도착 즉시 알림
2. **AI 기반 민원 분류** - 유사 민원 자동 매칭으로 처리 효율성 증대
3. **프라이버시 강화** - 동/호수 선택적 공개, 익명 소통 옵션
4. **수익 모델 통합** - 제휴 업체 소개를 통한 지속 가능한 BM 구축

## 에이전트 활용 방법

```bash
# PM 에이전트 (요구사항 분석, 기능 정의)
q chat --agent pm-agent

# 개발자 에이전트 (코드 구현, 아키텍처)
q chat --agent developer-agent

# 디자이너 에이전트 (UI/UX 설계)
q chat --agent designer-agent

# 인프라 에이전트 (AWS 인프라, 배포)
q chat --agent devops-agent
```

## 다음 단계

1. **기술 스택 결정** - Developer Agent와 협의
2. **UI/UX 설계** - Designer Agent와 협의
3. **인프라 아키텍처** - DevOps Agent와 협의
4. **파일럿 아파트 확보**
5. **MVP 개발 착수**
