import { Context } from "..";

export const Query = {
  posts: (_: any, __: any, { prisma }: Context) => {
    // Sort from most to least recent
    return prisma.post.findMany({
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
  },
};

