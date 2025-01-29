import { Profile, User } from "@prisma/client";

export const Query = {
  user: async (parent: any, args: { userId: string }, { prisma }: any) => {
    return await prisma.user.findUniqueOrThrow({
      where: {
        id: args.userId,
      },
      include: {
        posts: true,
        profile: true,
      },
    });
  },
  users: async (
    parent: any,
    args: User & { profile?: Profile },
    { prisma }: any
  ) => {
    return await prisma.user.findMany({
      include: {
        posts: true,
        profile: true,
      },
    });
  },
};
