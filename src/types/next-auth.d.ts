import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      apartmentId: string | null
      dong: string | null
      ho: string | null
      role: string
      avatar: string | null
    }
  }

  interface User {
    apartmentId: string | null
    dong: string | null
    ho: string | null
    role: string
    avatar: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    apartmentId: string | null
    dong: string | null
    ho: string | null
    role: string
    avatar: string | null
  }
}
