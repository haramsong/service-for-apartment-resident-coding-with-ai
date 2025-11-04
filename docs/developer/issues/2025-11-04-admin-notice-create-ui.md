# Admin 공지사항 작성 UI 구현

_작성일: 2025-11-04_

_작성자: Developer Agent_

## 작업 내용

Admin 권한 사용자를 위한 공지사항 작성 UI를 구현했습니다.

## 구현 사항

### 1. 공지사항 작성 페이지 (`/notices/new`)

**주요 기능:**
- 카테고리 선택 (일반, 시설관리, 행사, 안전)
- 긴급 공지 체크박스
- 제목 입력 (최대 200자, 글자 수 표시)
- 내용 입력 (Textarea)
- 유효성 검증 (제목/내용 필수)
- 작성 중 로딩 상태 표시

**권한 제어:**
- admin 권한이 아닌 경우 접근 차단 UI 표시
- 세션 정보로 권한 확인

### 2. 공지사항 목록 페이지 업데이트

**추가 기능:**
- admin 사용자에게만 "작성" 버튼 표시
- 헤더 레이아웃 조정 (제목과 버튼 양쪽 배치)

### 3. Textarea 컴포넌트 생성

**경로:** `/src/components/ui/textarea.tsx`

**특징:**
- shadcn/ui 스타일 일관성 유지
- 접근성 고려 (focus-visible, disabled 상태)
- 반응형 디자인

### 4. tRPC 라우터 업데이트

**변경 사항:**
- `notices.create` 뮤테이션에서 실제 사용자 정보 사용
- 관리자 권한 검증 로직 추가
- FORBIDDEN 에러 처리

## 기술적 결정

### 1. 권한 제어 이중화
- **클라이언트**: UI 레벨에서 접근 차단 (UX)
- **서버**: tRPC 뮤테이션에서 권한 검증 (보안)

### 2. 폼 유효성 검증
- 클라이언트 측 실시간 검증 (버튼 비활성화)
- 서버 측 Zod 스키마 검증

### 3. 사용자 경험
- 글자 수 카운터로 입력 가이드
- 로딩 상태 표시로 피드백 제공
- 취소 버튼으로 안전한 이탈 경로 제공

## 파일 변경 사항

### 생성된 파일
- `src/app/notices/new/page.tsx` - 공지사항 작성 페이지
- `src/components/ui/textarea.tsx` - Textarea 컴포넌트
- `docs/developer/issues/2025-11-04-admin-notice-create-ui.md` - 이슈 문서

### 수정된 파일
- `src/app/notices/page.tsx` - 작성 버튼 추가
- `src/server/trpc/routers/notices.ts` - 권한 검증 및 실제 데이터 사용

## 테스트 시나리오

### 1. Admin 사용자
1. 공지사항 목록에서 "작성" 버튼 확인
2. 작성 페이지 접근 가능
3. 모든 필드 입력 후 등록 성공
4. 목록 페이지로 리다이렉트

### 2. 일반 사용자
1. 공지사항 목록에서 "작성" 버튼 미표시
2. `/notices/new` 직접 접근 시 권한 없음 메시지
3. "공지사항 목록으로" 버튼으로 복귀

### 3. 유효성 검증
1. 제목 미입력 시 등록 버튼 비활성화
2. 내용 미입력 시 등록 버튼 비활성화
3. 제목 200자 초과 입력 불가

## 향후 개선 사항

### 1. 이미지 업로드
- 공지사항에 이미지 첨부 기능
- Supabase Storage 연동

### 2. 임시 저장
- 작성 중인 내용 자동 저장
- localStorage 활용

### 3. 미리보기
- 작성 중 미리보기 기능
- 실제 표시될 모습 확인

### 4. 수정/삭제
- 작성한 공지사항 수정 기능
- 삭제 기능 (soft delete)

## 참고 문서

- `docs/developer/api-specification.md` - API 명세
- `docs/common/PRD-apartment-community-platform.md` - 제품 요구사항
- `docs/designer/ui-ux-guidelines-v2.md` - UI/UX 가이드라인
