import { Context } from "..";

export const Query = {
  self: (_: any, __: any, { userInformation, prisma }: Context) => {
    if (!userInformation) return null;

    return prisma.user.findUnique({
      where: {
        id: userInformation.userId
      }
    });
  },
  // Get userId from arguments, not context
  profile: (_: any, { userId }: { userId: string }, { prisma }: Context ) => {
    return prisma.profile.findUnique({
      where: {
        userId: Number(userId)
      }
    });
  },
  posts: (_: any, __: any, { prisma }: Context) => {
    // Sort from most to least recent
    return prisma.post.findMany({
      where: {
        published: true
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
  },
};

