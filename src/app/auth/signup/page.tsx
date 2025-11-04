"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { ApartmentSelectDialog } from "@/components/auth/ApartmentSelectDialog";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
    apartmentId: "",
    dong: "",
    ho: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const passwordRules = [
    { key: "minLength", label: "8자 이상" },
    { key: "hasLetter", label: "영문 대/소문자" },
    { key: "hasNumber", label: "숫자" },
    { key: "hasSpecialChar", label: "특수문자" },
  ];

  // 비밀번호 검증 조건
  const passwordValidation = {
    minLength: formData.password.length >= 8,
    hasLetter: /[a-zA-Z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  const signUpMutation = trpc.auth.signUp.useMutation({
    onSuccess: () => {
      router.push("/auth/signin?message=회원가입이 완료되었습니다");
    },
    onError: (error) => {
      setErrors({ submit: error.message });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 실시간 검증 수행
    const validationErrors: Record<string, string> = {};

    // 이메일 검증
    if (!formData.email) {
      validationErrors.email = "이메일을 입력해주세요";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.email = "올바른 이메일 형식이 아닙니다";
    }

    // 비밀번호 검증
    if (!formData.password) {
      validationErrors.password = "비밀번호를 입력해주세요";
    } else if (!passwordValidation.minLength) {
      validationErrors.password = "비밀번호는 8자 이상이어야 합니다";
    } else if (!passwordValidation.hasLetter) {
      validationErrors.password = "영문 대/소문자를 포함해야 합니다";
    } else if (!passwordValidation.hasSpecialChar) {
      validationErrors.password = "특수문자를 포함해야 합니다";
    }

    // 비밀번호 확인 검증
    if (!formData.passwordConfirm) {
      validationErrors.passwordConfirm = "비밀번호 확인을 입력해주세요";
    } else if (formData.password !== formData.passwordConfirm) {
      validationErrors.passwordConfirm = "비밀번호가 일치하지 않습니다";
    }

    // 이름 검증
    if (!formData.name) {
      validationErrors.name = "이름을 입력해주세요";
    } else if (formData.name.length < 2) {
      validationErrors.name = "이름은 2자 이상이어야 합니다";
    }

    // 아파트 선택 확인
    if (!formData.apartmentId) {
      validationErrors.apartmentId = "아파트를 선택해주세요";
    }

    // 동/호수 검증
    if (!formData.dong) {
      validationErrors.dong = "동을 입력해주세요";
    }
    if (!formData.ho) {
      validationErrors.ho = "호를 입력해주세요";
    }

    // 에러가 있으면 상태 업데이트 후 중단
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // 모든 검증 통과 시 회원가입 진행
    signUpMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApartmentSelect = (apartmentId: string) => {
    setFormData((prev) => ({ ...prev, apartmentId }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">회원가입</CardTitle>
          <p className="text-sm text-gray-500 text-center mt-2">
            아파트 커뮤니티에 오신 것을 환영합니다
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 기본 정보 */}
            <div className="space-y-4">
              <FormField
                id="email"
                name="email"
                label="이메일"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                autoFocus
                autoComplete="email"
              />

              <FormField
                id="password"
                name="password"
                label="비밀번호"
                type="password"
                placeholder="8자 이상 입력해주세요"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
              >
                {/* 비밀번호 요구사항 */}
                <div className="mt-1">
                  <div className="flex gap-x-6 gap-y-1">
                    {passwordRules.map(({ key, label }) => {
                      const valid =
                        passwordValidation[
                          key as keyof typeof passwordValidation
                        ];
                      return (
                        <p
                          key={key}
                          className={`text-xs flex items-center gap-1 ${
                            valid ? "text-green-600" : "text-gray-500"
                          }`}
                        >
                          <span>{valid ? "✓" : "○"}</span>
                          <span>{label}</span>
                        </p>
                      );
                    })}
                  </div>
                </div>
              </FormField>

              <FormField
                id="passwordConfirm"
                name="passwordConfirm"
                label="비밀번호 확인"
                type="password"
                placeholder="비밀번호를 다시 입력해주세요"
                value={formData.passwordConfirm}
                onChange={handleChange}
                error={errors.passwordConfirm}
                required
              />

              <FormField
                id="name"
                name="name"
                label="이름"
                type="text"
                placeholder="홍길동"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
                autoComplete="name"
              />
            </div>

            {/* 아파트 선택 */}
            <div className="pt-4 border-t">
              <ApartmentSelectDialog
                selectedApartmentId={formData.apartmentId}
                onSelect={handleApartmentSelect}
                error={errors.apartmentId}
              />
            </div>

            {/* 동/호수 입력 */}
            {formData.apartmentId && (
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-gray-700 mb-1 block"
                  htmlFor="dong"
                >
                  동/호수 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Input
                      id="dong"
                      name="dong"
                      type="text"
                      placeholder="동"
                      value={formData.dong}
                      onChange={handleChange}
                      className={errors.dong ? "border-red-500" : ""}
                    />
                  </div>
                  <div>
                    <Input
                      id="ho"
                      name="ho"
                      type="text"
                      placeholder="호"
                      value={formData.ho}
                      onChange={handleChange}
                      className={errors.ho ? "border-red-500" : ""}
                    />
                  </div>
                </div>

                {(errors.dong || errors.ho) && (
                  <p className="text-xs text-red-600 mt-1 flex items-center">
                    <span className="mr-1">✗</span> {errors.dong || errors.ho}
                  </p>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={signUpMutation.isPending}
            >
              {signUpMutation.isPending ? "가입 중..." : "회원가입"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/auth/signin"
              className="text-primary-500 hover:underline text-sm"
            >
              이미 계정이 있으신가요? 로그인
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
