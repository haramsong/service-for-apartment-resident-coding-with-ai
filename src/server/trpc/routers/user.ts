import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

export const userRouter = router({
  // 사용자 활동 통계
  getActivityStats: protectedProcedure.query(async ({ ctx }) => {
    const [postsCount, commentsCount, reservationsCount] = await Promise.all([
      prisma.post.count({
        where: { authorId: ctx.user.id },
      }),
      prisma.comment.count({
        where: { authorId: ctx.user.id },
      }),
      prisma.reservation.count({
        where: { userId: ctx.user.id },
      }),
    ]);

    return {
      postsCount,
      commentsCount,
      reservationsCount,
    };
  }),

  // 아바타 업로드
  updateAvatar: protectedProcedure
    .input(z.object({ avatar: z.url() }))
    .mutation(async ({ ctx, input }) => {
      const user = await prisma.user.update({
        where: { id: ctx.user.id },
        data: { avatar: input.avatar },
        select: { id: true, avatar: true },
      });

      return user;
    }),
});
