import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { apartment: true }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          apartmentId: user.apartmentId,
          dong: user.dong,
          ho: user.ho,
          role: user.role,
          avatar: user.avatar,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.apartmentId = user.apartmentId
        token.dong = user.dong
        token.ho = user.ho
        token.role = user.role
        token.avatar = user.avatar
      }
      
      // update() 호출 시 최신 사용자 정보 가져오기
      if (trigger === 'update' && token.sub) {
        const updatedUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { avatar: true }
        })
        if (updatedUser) {
          token.avatar = updatedUser.avatar
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.apartmentId = token.apartmentId as string
        session.user.dong = token.dong as string
        session.user.ho = token.ho as string
        session.user.role = token.role as string
        session.user.avatar = token.avatar as string | null
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
  }
}
