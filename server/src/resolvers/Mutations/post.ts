import { Prisma, Post } from ".prisma/client";
import { Context } from "../../index"
import { canUserMutatePost } from "../../utils/canUserMutatePost";

interface PostArgs {
  post: {
    title?: string
    content?: string
  }
}

interface PostPayloadType {
  userErrors: {
    message: string
  }[],
  post: Post | Prisma.Prisma__PostClient<Post> | null
}

export const postResolvers = {
  postCreate: async (
    _: any,
    { post, postId }: {postId: string, post: PostArgs["post"]},
    { prisma, userInformation }: Context
  ): Promise<PostPayloadType> => {

    if (!userInformation) {
      return {
        userErrors: [
          {
            message: "I am error. Unauthenticated access."
          }
        ],
        post: null
      }
    }

    const error = await canUserMutatePost({
      userId: userInformation.userId,
      postId: Number(postId),
      prisma
    });

    if (error) return error;

    const { title, content } = post;
    if (!title || !content) {
      return {
        userErrors: [{
          message: "You must provide a title and some content in order to create a post"
        }],
        post: null,
      };
    }

    return {
      userErrors: [],
      post: prisma.post.create({
        data: {
          title,
          content,
          authorId: userInformation.userId
        }
      })
    }
  },
  postUpdate: async (
    _: any,
    { post, postId }: {postId: string, post: PostArgs["post"]},
    { prisma, userInformation }: Context, 
  ): Promise<PostPayloadType> => {
    const { title, content } = post;

    if (!title && !content) {
      return {
        userErrors: [
          {
            message: "I am error: You need at least one field to update"
          },
        ],
        post: null
      }
    }

    const existingPost = await prisma.post.findUnique({
      where: {
        id: Number(postId)
      }
    });

    if (!existingPost) {
      return {
        userErrors: [
          {
            message: "I am error: Post doesn't exist"
          },
        ],
        post: null
      }
    }

    let payloadToUpdate = {
      title, content
    };

    if (!title) delete payloadToUpdate.title;
    if (!content) delete payloadToUpdate.content;

    return {
      userErrors: [],
      post: prisma.post.update({
        data: {
          ...payloadToUpdate
        },
        where: {
          id: Number(postId),
        }
      })
    }
  },
  postDelete: async (
    _: any,
    { postId }: { postId: string },
    { prisma, userInformation }: Context
    ): Promise<PostPayloadType> => {
      const post = await prisma.post.findUnique({
        where: {
          id: Number(postId)
        }
      });

      if (!userInformation) {
        return {
          userErrors: [
            {
              message: "I am error. Unauthenticated access."
            }
          ],
          post: null
        }
      }
  
      const error = await canUserMutatePost({
        userId: userInformation.userId,
        postId: Number(postId),
        prisma
      });
  
      if (error) return error;

      if (!post) {
        return {
          userErrors: [
            {
              message: "I am error: Post doesn't exist"
            },
          ],
          post: null
        }
      }

      await prisma.post.delete({
        where: {
          id: Number(postId)
        }
      });

      return {
        userErrors: [],
        post
      };
    },
    postPublish: async (
      _: any,
      { postId }: { postId: string },
      { prisma, userInformation }: Context
      ): Promise<PostPayloadType> => {

        if (!userInformation) {
          return {
            userErrors: [
              {
                message: "I am error. Unauthenticated access."
              }
            ],
            post: null
          }
        }
    
        const error = await canUserMutatePost({
          userId: userInformation.userId,
          postId: Number(postId),
          prisma
        });
    
        if (error) return error;

        return {
          userErrors: [],
          post: prisma.post.update({
            where: {
              id: Number(postId) 
            },
            data: {
              published: true
            }
          })
        }
    },
    postUnpublish: async (
      _: any,
      { postId }: { postId: string },
      { prisma, userInformation }: Context
      ): Promise<PostPayloadType> => {

        if (!userInformation) {
          return {
            userErrors: [
              {
                message: "I am error. Unauthenticated access."
              }
            ],
            post: null
          }
        }
    
        const error = await canUserMutatePost({
          userId: userInformation.userId,
          postId: Number(postId),
          prisma
        });
    
        if (error) return error;

        return {
          userErrors: [],
          post: prisma.post.update({
            where: {
              id: Number(postId) 
            },
            data: {
              published: false
            }
          })
        }
    }
};