import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { getUserInfoFromToken } from "./utils/jwtHelpers";

const prisma = new PrismaClient();

interface IContext {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
  userInfo?: {
    userId: string | null;
  } | null;
}

const main = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }): Promise<IContext> => {
      const token = req.headers.authorization;

      if (!token) {
        return {
          prisma,
          userInfo: null,
        };
      }

      const userInfo = await getUserInfoFromToken(token);
      return {
        prisma,
        userInfo,
      };
    },
  });

  console.log(`🚀  Server ready at: ${url}`);
};

main();
