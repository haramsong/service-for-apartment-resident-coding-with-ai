'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Building2, MapPin } from 'lucide-react'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    apartmentId: '',
    dong: '',
    ho: '',
  })
  const [error, setError] = useState('')
  const router = useRouter()

  // 실제로는 API에서 가져와야 하지만, 현재는 더미 데이터 사용
  const apartments = [
    { id: 'apt-1', name: '우리아파트', address: '서울시 강남구' },
    { id: 'apt-2', name: '행복아파트', address: '서울시 서초구' },
    { id: 'apt-3', name: '푸른아파트', address: '서울시 송파구' },
  ]

  const signUpMutation = trpc.auth.signUp.useMutation({
    onSuccess: () => {
      router.push('/auth/signin?message=회원가입이 완료되었습니다')
    },
    onError: (error) => {
      setError(error.message)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.')
      return
    }

    if (!formData.apartmentId) {
      setError('아파트를 선택해주세요.')
      return
    }

    signUpMutation.mutate(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const selectedApartment = apartments.find(apt => apt.id === formData.apartmentId)

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
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  이메일
                </label>
                <Input
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  비밀번호
                </label>
                <Input
                  name="password"
                  type="password"
                  placeholder="8자 이상 입력해주세요"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  이름
                </label>
                <Input
                  name="name"
                  type="text"
                  placeholder="홍길동"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* 아파트 선택 */}
            <div className="pt-4 border-t">
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Building2 className="w-4 h-4 mr-1" />
                거주 아파트
              </label>
              <Select
                value={formData.apartmentId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, apartmentId: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="아파트를 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  {apartments.map((apt) => (
                    <SelectItem key={apt.id} value={apt.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{apt.name}</span>
                        <span className="text-xs text-gray-500">{apt.address}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedApartment && (
                <div className="mt-2 p-2 bg-blue-50 rounded-md flex items-start">
                  <MapPin className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">{selectedApartment.name}</p>
                    <p className="text-blue-700">{selectedApartment.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* 동/호수 입력 */}
            {formData.apartmentId && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  동/호수
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Input
                      name="dong"
                      type="text"
                      placeholder="101동"
                      value={formData.dong}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      name="ho"
                      type="text"
                      placeholder="1001호"
                      value={formData.ho}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  예: 101동 1001호
                </p>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={signUpMutation.isPending}
            >
              {signUpMutation.isPending ? '가입 중...' : '회원가입'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="/auth/signin" className="text-primary-500 hover:underline text-sm">
              이미 계정이 있으신가요? 로그인
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
