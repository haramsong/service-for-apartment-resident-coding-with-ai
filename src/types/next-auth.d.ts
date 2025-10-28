import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      apartmentId: string
      dong: string
      ho: string
      role: string
    }
  }

  interface User {
    apartmentId: string
    dong: string
    ho: string
    role: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    apartmentId: string
    dong: string
    ho: string
    role: string
  }
}
