import { Context } from "vm";
import {  } from "../index"

interface PostCreateArgs {
  title: string
  content: string
}

export const Mutation = {
  postCreate: async (_: any, {title, content}: any, { prisma }: Context) => {
    prisma.post.create({
      data: {
        title,
        content,
        authorId: 1 // hardcoding this to 1 until auth layer set up
      }
    })
  }
};