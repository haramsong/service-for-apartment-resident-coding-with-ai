import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth-utils";
import { TRPCError } from "@trpc/server";

export const authRouter = router({
  // 회원가입
  signUp: publicProcedure
    .input(
      z.object({
        email: z.email(),
        password: z.string().min(8),
        name: z.string(),
        apartmentId: z.string(),
        dong: z.string(),
        ho: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // 이메일 중복 확인
      const existing = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "이미 존재하는 이메일입니다",
        });
      }

      // 비밀번호 해싱
      const hashedPassword = await hashPassword(input.password);

      const user = await prisma.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          name: input.name,
          apartmentId: input.apartmentId,
          dong: input.dong,
          ho: input.ho,
        },
        include: {
          apartment: true,
        },
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          apartmentId: user.apartmentId,
          dong: user.dong,
          ho: user.ho,
          role: user.role,
        },
        message: "회원가입이 완료되었습니다. 로그인해주세요.",
      };
    }),

  // 프로필 조회
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      where: { id: ctx.user.id },
      include: {
        apartment: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "사용자를 찾을 수 없습니다",
      });
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      apartment: user.apartment ? {
        id: user.apartment.id,
        name: user.apartment.name,
      } : null,
      dong: user.dong,
      ho: user.ho,
      role: user.role,
      createdAt: user.createdAt,
    };
  }),

  // 프로필 업데이트
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        dong: z.string().optional(),
        ho: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await prisma.user.update({
        where: { id: ctx.user.id },
        data: input,
      });

      return {
        id: user.id,
        name: user.name,
        dong: user.dong,
        ho: user.ho,
        updatedAt: user.updatedAt,
      };
    }),
});
