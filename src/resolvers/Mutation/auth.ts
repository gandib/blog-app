import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { generateToken } from "../../utils/jwtHelpers";
import config from "../../config";

export const authResolvers = {
  signup: async (
    parent: any,
    args: User & { bio?: string },
    { prisma }: any
  ) => {
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
    { prisma }: any
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

    const verifyPassword = await bcrypt.compare(args.password, user?.password!);
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
};
