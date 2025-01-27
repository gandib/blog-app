import { Post, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwtHelpers";
import config from "../config";

const prisma = new PrismaClient();

type TUserInfo = {
  name: string;
  email: string;
  password: string;
  bio?: string;
};

export const resolvers = {
  Query: {
    user: async (parent: any, args: { userId: string }, context: any) => {
      return await prisma.user.findUniqueOrThrow({
        where: {
          id: args.userId,
        },
      });
    },
    users: async (parent: any, args: TUserInfo, context: any) => {
      return await prisma.user.findMany();
    },
  },
  Mutation: {
    signup: async (parent: any, args: TUserInfo, context: any) => {
      const user = await prisma.user.findUnique({
        where: {
          email: args.email,
        },
      });

      if (user) {
        return {
          userError: "User is already exists!",
          token: null,
        };
      }

      const hashedPassword = await bcrypt.hash(args.password, 12);
      args.password = hashedPassword;

      const createUser = await prisma.user.create({
        data: {
          name: args.name,
          email: args.email,
          password: args.password,
        },
      });

      if (args.bio) {
        await prisma.profile.create({
          data: {
            bio: args.bio,
            userId: createUser.id,
          },
        });
      }

      const token = await generateToken(
        { userId: createUser.id },
        config.jwt_secret_token as string
      );
      return {
        token,
      };
    },

    signin: async (
      parent: any,
      args: { email: string; password: string },
      context: any
    ) => {
      const user = await prisma.user.findUnique({
        where: {
          email: args.email,
        },
      });

      if (!user) {
        return {
          userError: "User not found!",
          token: null,
        };
      }

      const verifyPassword = await bcrypt.compare(
        args.password,
        user?.password!
      );
      if (!verifyPassword) {
        return {
          userError: "User credentials is incorrect!",
          token: null,
        };
      }

      const token = await generateToken(
        { userId: user.id },
        config.jwt_secret_token as string
      );
      return {
        userError: null,
        token,
      };
    },

    createPost: async (
      parent: any,
      args: Post & { authorId: string },
      context: any
    ) => {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: args.authorId,
        },
      });

      // if (!user) {

      // }

      return await prisma.post.create({
        data: {
          title: args.title,
          content: args.content,
          authorId: user.id,
        },
      });
    },
  },
};
