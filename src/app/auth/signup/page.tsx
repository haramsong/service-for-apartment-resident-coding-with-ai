"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Building2, MapPin, Search } from "lucide-react";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // 비밀번호 검증 조건
  const passwordValidation = {
    minLength: formData.password.length >= 8,
    hasLowerCase: /[a-z]/.test(formData.password),
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  // 실제 DB에서 아파트 목록 조회
  const { data: apartments = [], isLoading: isLoadingApartments } =
    trpc.auth.getApartments.useQuery();

  // 검색 필터링
  const filteredApartments = apartments.filter(
    (apt) =>
      apt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    } else if (
      !passwordValidation.hasLowerCase &&
      !passwordValidation.hasUpperCase
    ) {
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
    setIsDialogOpen(false);
    setSearchQuery("");
  };

  const selectedApartment = apartments.find(
    (apt) => apt.id === formData.apartmentId
  );

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

              <div>
                <label
                  className="text-sm font-medium text-gray-700 mb-1 block"
                  htmlFor="password"
                >
                  비밀번호 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="8자 이상 입력해주세요"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pr-10 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />

                  {errors.password && (
                    <p className="text-xs text-red-600 mt-1 flex items-center">
                      <span className="mr-1">✗</span> {errors.password}
                    </p>
                  )}
                </div>

                {/* 비밀번호 요구사항 */}
                <div className="mt-2">
                  <div className="flex gap-x-6 gap-y-1">
                    <p
                      className={`text-xs flex items-center gap-1 ${
                        passwordValidation.minLength
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      <span>{passwordValidation.minLength ? "✓" : "○"}</span>
                      <span>8자 이상</span>
                    </p>
                    <p
                      className={`text-xs flex items-center gap-1 ${
                        passwordValidation.hasLowerCase ||
                        passwordValidation.hasUpperCase
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      <span>
                        {passwordValidation.hasLowerCase ||
                        passwordValidation.hasUpperCase
                          ? "✓"
                          : "○"}
                      </span>
                      <span>영문 대/소문자</span>
                    </p>
                    <p
                      className={`text-xs flex items-center gap-1 ${
                        passwordValidation.hasNumber
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      <span>{passwordValidation.hasNumber ? "✓" : "○"}</span>
                      <span>숫자</span>
                    </p>
                    <p
                      className={`text-xs flex items-center gap-1 ${
                        passwordValidation.hasSpecialChar
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      <span>
                        {passwordValidation.hasSpecialChar ? "✓" : "○"}
                      </span>
                      <span>특수문자</span>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label
                  className="text-sm font-medium text-gray-700 mb-1 block"
                  htmlFor="passwordConfirm"
                >
                  비밀번호 확인 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="passwordConfirm"
                    name="passwordConfirm"
                    type="password"
                    placeholder="비밀번호를 다시 입력해주세요"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    className={
                      errors.passwordConfirm ? "border-red-500 pr-10" : "pr-10"
                    }
                  />

                  {errors.passwordConfirm && (
                    <p className="text-xs text-red-600 mt-1 flex items-center">
                      <span className="mr-1">✗</span> {errors.passwordConfirm}
                    </p>
                  )}
                </div>

                {/* 비밀번호 일치 여부 표시 */}
                {formData.passwordConfirm && (
                  <div className="mt-2">
                    {formData.password === formData.passwordConfirm ? (
                      <p className="text-xs text-green-600 flex items-center">
                        <span className="mr-1">✓</span> 비밀번호가 일치합니다
                      </p>
                    ) : (
                      <p className="text-xs text-red-600 flex items-center">
                        <span className="mr-1">✗</span> 비밀번호가 일치하지
                        않습니다
                      </p>
                    )}
                  </div>
                )}
              </div>

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
              <label
                className="text-sm font-medium text-gray-700 mb-2 flex items-center"
                htmlFor="apartmentName"
              >
                <Building2 className="w-4 h-4 mr-1" />
                거주 아파트 <span className="text-red-500 ml-1">*</span>
              </label>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    id="apartmentName"
                    type="button"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {selectedApartment ? (
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 mr-2" />
                        <span>{selectedApartment.name}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">
                        아파트를 검색해주세요
                      </span>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>아파트 검색</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* 검색 입력 */}
                    <div className="relative">
                      <label
                        className="hidden sr-only"
                        htmlFor="apartmentSearch"
                      >
                        아파트 검색
                      </label>
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="apartmentSearch"
                        placeholder="아파트명 또는 주소로 검색"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* 검색 결과 */}
                    <div className="max-h-[300px] overflow-y-auto space-y-2">
                      {isLoadingApartments ? (
                        <div className="text-center py-8 text-gray-500">
                          <p>아파트 목록을 불러오는 중...</p>
                        </div>
                      ) : filteredApartments.length > 0 ? (
                        filteredApartments.map((apt) => (
                          <button
                            key={apt.id}
                            type="button"
                            onClick={() => handleApartmentSelect(apt.id)}
                            className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-start">
                              <Building2 className="w-5 h-5 text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-medium text-gray-900">
                                  {apt.name}
                                </p>
                                <p className="text-sm text-gray-500 mt-0.5">
                                  {apt.address}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Building2 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                          <p>검색 결과가 없습니다</p>
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {selectedApartment && (
                <div className="mt-2 p-3 bg-primary-50 border border-primary-200 rounded-lg flex items-start">
                  <MapPin className="w-4 h-4 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-primary-900">
                      {selectedApartment.name}
                    </p>
                    <p className="text-primary-700">
                      {selectedApartment.address}
                    </p>
                  </div>
                </div>
              )}

              {errors.apartmentId && (
                <p className="text-xs text-red-600 mt-1 flex items-center">
                  <span className="mr-1">✗</span> {errors.apartmentId}
                </p>
              )}
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
