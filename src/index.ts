import { ApolloServer } from "apollo-server";
import { typeDefs} from "./schema";
import { Query } from "./resolvers";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

interface Context {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never>
}

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
  },
  context: {
    prisma
  }
});

server.listen().then(({url}) => {
  console.log(`server listening on ${url}`);
});
