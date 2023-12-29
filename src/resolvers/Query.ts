import { Context } from "..";

export const Query = {
  self: (_: any, __: any, { userInformation, prisma }: Context) => {
    if (!userInformation) return null;

    return prisma.user.findUnique({
      where: {
        id: userInformation.userId
      }
    })
  },
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

