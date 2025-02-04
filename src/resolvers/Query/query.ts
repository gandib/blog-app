import { Profile, User } from "@prisma/client";
import { prisma } from "../../prisma";

export const Query = {
  user: async (parent: any, args: any, { userInfo }: any) => {
    return await prisma.user.findUniqueOrThrow({
      where: {
        id: userInfo.userId,
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

  posts: async (parent: any, args: any, { userInfo }: any) => {
    return await prisma.post.findMany({
      where: {
        published: true,
        authorId: userInfo.userId,
      },
      include: {
        author: true,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
  },
};
