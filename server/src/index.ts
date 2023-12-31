import { ApolloServer } from "apollo-server";
import { typeDefs} from "./schema";
import { Query, Mutation, Post, Profile, User } from "./resolvers";
import { PrismaClient, Prisma } from "@prisma/client";
import { getUserFromToken } from "./utils/getuserFromToken";

export const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never>;
  userInformation: {
    userId: number;
  } | null;
}

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    Post,
    Profile,
    User
  },
  context: async ({ req }: any): Promise<Context> => {
    const userInformation = await getUserFromToken(req.headers.authorization);

    return {
      prisma,
      userInformation
    };
  }
});

server.listen().then(({url}) => {
  console.log(`server listening on ${url}`);
});
