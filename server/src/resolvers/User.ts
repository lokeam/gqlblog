import { Context } from "..";

interface UserParentType {
  id: number;
}

export const User = {
  posts: (
    parent: UserParentType,
    __: any,
    { userInformation, prisma }: Context) => {
      const isOwnAccount = parent.id === userInformation?.userId;

      if (isOwnAccount) {
        return prisma.post.findMany({
          where: {
            authorId: parent.id
          },
          orderBy: [
            {
              createdAt: "desc"
            }
          ]
        })
        // if this isn't your profile, only show published posts
      } else {
        return prisma.post.findMany({
          where: {
            authorId: parent.id,
            published: true
          },
          orderBy: [
            {
              createdAt: "desc"
            }
          ]
        })
      }
  }
};

