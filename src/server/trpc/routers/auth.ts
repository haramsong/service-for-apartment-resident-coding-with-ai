import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";
import { TRPCError } from "@trpc/server";

export const authRouter = router({
  // 아파트 목록 조회
  getApartments: publicProcedure.query(async () => {
    const apartments = await prisma.apartment.findMany({
      orderBy: { name: "asc" },
    });
    return apartments;
  }),

  // 회원가입
  signUp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string(),
        apartmentId: z.string(),
        dong: z.string(),
        ho: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Supabase Auth에 사용자 생성
      const { data: authData, error: authError } = await ctx.supabase.auth.signUp({
        email: input.email,
        password: input.password,
      });

      if (authError) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: authError.message,
        });
      }

      if (!authData.user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "사용자 생성에 실패했습니다",
        });
      }

      // Prisma에 사용자 정보 저장
      const user = await prisma.user.create({
        data: {
          id: authData.user.id,
          email: input.email,
          password: "", // Supabase Auth 사용으로 불필요
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
