'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

    signUpMutation.mutate(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">회원가입</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="email"
              type="email"
              placeholder="이메일"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              name="password"
              type="password"
              placeholder="비밀번호 (8자 이상)"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Input
              name="name"
              type="text"
              placeholder="이름"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              name="apartmentId"
              type="text"
              placeholder="아파트 ID"
              value={formData.apartmentId}
              onChange={handleChange}
              required
            />
            <div className="flex space-x-2">
              <Input
                name="dong"
                type="text"
                placeholder="동"
                value={formData.dong}
                onChange={handleChange}
                required
              />
              <Input
                name="ho"
                type="text"
                placeholder="호"
                value={formData.ho}
                onChange={handleChange}
                required
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={signUpMutation.isPending}
            >
              {signUpMutation.isPending ? '가입 중...' : '회원가입'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <a href="/auth/signin" className="text-primary-500 hover:underline">
              이미 계정이 있으신가요? 로그인
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
