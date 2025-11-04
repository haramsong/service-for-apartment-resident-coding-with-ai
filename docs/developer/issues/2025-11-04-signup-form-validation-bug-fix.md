# 회원가입 폼 에러 표시 버그 수정

*작성일: 2025-11-04*

*작성자: Developer Agent*

*이슈 유형: 버그 수정*

*우선순위: High*

## 🐛 문제 상황

### 발견된 버그
1. **검증 실패해도 제출됨**: 필수 필드가 비어있거나 형식이 잘못되어도 회원가입 API 호출
2. **에러 메시지 미표시**: 검증 실패 시 에러 메시지가 표시되지 않음
3. **동/호수 에러 표시 오류**: 조건문 구문 오류로 에러 메시지 미표시
4. **입력 필드 빨간 테두리 누락**: 에러 발생 시 시각적 피드백 부족

### 재현 방법
1. 회원가입 페이지 접속
2. 필수 필드를 비우거나 잘못된 형식으로 입력
3. 회원가입 버튼 클릭
4. 에러 메시지 없이 API 호출 시도

## 🔍 원인 분석

### 1. 비동기 상태 업데이트 문제
```typescript
// 문제가 있던 코드
fieldsToValidate.forEach((field) => {
  validateField(field, formData[field]);
});

// 바로 다음 줄에서 errors 체크
if (Object.keys(errors).length > 0) {
  return;
}
```

**문제점**:
- `validateField`가 `setErrors`를 호출하지만 상태 업데이트는 비동기
- 바로 다음 줄에서 `errors`를 체크하면 이전 값을 참조
- 결과적으로 검증 실패해도 제출이 진행됨

### 2. 동/호수 에러 표시 구문 오류
```typescript
// 문제가 있던 코드
{errors.dong || (errors.ho && (
  <p>...</p>
))}
```

**문제점**:
- 조건문 구조가 잘못되어 에러 메시지가 표시되지 않음
- `errors.dong`이 없으면 `errors.ho`도 체크하지 않음

### 3. 입력 필드 에러 스타일 누락
- 비밀번호 확인, 이름, 동/호수 필드에 `border-red-500` 클래스 미적용
- 사용자가 어떤 필드에 에러가 있는지 시각적으로 파악 어려움

## ✅ 해결 방법

### 1. 동기적 검증 로직으로 변경
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // 모든 필드를 터치 상태로 설정
  const allFields = ["email", "password", "passwordConfirm", "name", "dong", "ho"];
  const newTouched: Record<string, boolean> = {};
  allFields.forEach((field) => {
    newTouched[field] = true;
  });
  setTouched(newTouched);

  // 동기적으로 검증 수행
  const validationErrors: Record<string, string> = {};

  // 각 필드 검증 (동기적)
  if (!formData.email) {
    validationErrors.email = "이메일을 입력해주세요";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    validationErrors.email = "올바른 이메일 형식이 아닙니다";
  }
  // ... 나머지 필드 검증

  // 에러가 있으면 상태 업데이트 후 중단
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  // 모든 검증 통과 시 회원가입 진행
  signUpMutation.mutate(formData);
};
```

### 2. 동/호수 에러 표시 수정
```typescript
// 수정된 코드
{(errors.dong || errors.ho) && (
  <p className="text-xs text-red-600 mt-1 flex items-center">
    <span className="mr-1">✗</span> {errors.dong || errors.ho}
  </p>
)}
```

### 3. 입력 필드 에러 스타일 추가
```typescript
// 비밀번호 확인
className={errors.passwordConfirm ? "border-red-500 pr-10" : "pr-10"}

// 이름
className={errors.name ? "border-red-500" : ""}

// 동/호수
className={errors.dong ? "border-red-500" : ""}
className={errors.ho ? "border-red-500" : ""}
```

### 4. 실시간 검증 개선
```typescript
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
  
  // 필드를 터치 상태로 설정
  setTouched((prev) => ({ ...prev, [name]: true }));
  
  // 실시간 검증 (터치 여부 체크 제거)
  validateField(name, value);
};
```

## 📊 개선 효과

### 1. 정확한 검증
- 모든 필드 검증 후 에러가 있으면 제출 차단
- 동기적 검증으로 상태 업데이트 타이밍 문제 해결

### 2. 명확한 피드백
- 에러가 있는 필드에 빨간 테두리 표시
- 에러 메시지 정확히 표시
- 사용자가 어떤 필드를 수정해야 하는지 명확히 인지

### 3. 사용자 경험 향상
- 제출 전 모든 에러 확인 가능
- 불필요한 API 호출 방지
- 즉각적인 시각적 피드백

## 🔄 예방 방법

### 1. 검증 로직 패턴
- 제출 시에는 동기적 검증 수행
- 실시간 검증은 `validateField` 함수 활용
- 상태 업데이트 타이밍 고려

### 2. 에러 표시 체크리스트
- [ ] 모든 입력 필드에 에러 스타일 적용
- [ ] 에러 메시지 표시 조건 확인
- [ ] 조건문 구문 검증

### 3. 테스트 시나리오
- 모든 필드 비우고 제출
- 잘못된 형식으로 입력 후 제출
- 일부 필드만 입력 후 제출
- 에러 수정 후 재제출

## 📚 참고 문서
- [회원가입 UI/UX 개선](./2025-11-03-signup-apartment-selection-improvement.md)
- [비밀번호 입력 개선](./2025-11-03-password-input-ux-improvement.md)

---

*회원가입 폼 검증 로직이 수정되어 정확한 에러 표시와 제출 차단이 가능합니다.*
