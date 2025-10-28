'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { trpc } from '@/lib/trpc/client'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    apartmentId: '',
    dong: '',
    ho: '',
  })
  const [error, setError] = useState('')
  const router = useRouter()

  const signUpMutation = trpc.auth.signUp.useMutation({
    onSuccess: () => {
      alert('회원가입이 완료되었습니다. 로그인해주세요.')
      router.push('/auth/signin')
    },
    onError: (error) => {
      setError(error.message)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    if (formData.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.')
      return
    }

    signUpMutation.mutate({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      apartmentId: formData.apartmentId,
      dong: formData.dong,
      ho: formData.ho,
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary-600">
            우리동네
          </CardTitle>
          <CardDescription>
            아파트 커뮤니티에 가입하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                이메일
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="이메일을 입력하세요"
                required
                disabled={signUpMutation.isLoading}
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                이름
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="이름을 입력하세요"
                required
                disabled={signUpMutation.isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="dong" className="block text-sm font-medium text-gray-700 mb-1">
                  동
                </label>
                <Input
                  id="dong"
                  name="dong"
                  type="text"
                  value={formData.dong}
                  onChange={handleChange}
                  placeholder="101"
                  required
                  disabled={signUpMutation.isLoading}
                />
              </div>
              <div>
                <label htmlFor="ho" className="block text-sm font-medium text-gray-700 mb-1">
                  호
                </label>
                <Input
                  id="ho"
                  name="ho"
                  type="text"
                  value={formData.ho}
                  onChange={handleChange}
                  placeholder="1001"
                  required
                  disabled={signUpMutation.isLoading}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="8자 이상 입력하세요"
                required
                disabled={signUpMutation.isLoading}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호 확인
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="비밀번호를 다시 입력하세요"
                required
                disabled={signUpMutation.isLoading}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={signUpMutation.isLoading}
            >
              {signUpMutation.isLoading ? '가입 중...' : '회원가입'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              이미 계정이 있으신가요?{' '}
              <a href="/auth/signin" className="text-primary-600 hover:text-primary-700 font-medium">
                로그인
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
