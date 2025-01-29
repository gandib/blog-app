import { Post } from "@prisma/client";
import { prisma } from "../../prisma";

export const postResolvers = {
  createPost: async (
    parent: any,
    args: Post & { authorId: string },
    { userInfo }: any
  ) => {
    if (!userInfo) {
      return {
        userError: "You are not authorized!",
        post: null,
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userInfo.userId,
      },
    });

    if (!user) {
      return {
        userError: "User not found!",
        post: null,
      };
    }

    const result = await prisma.post.create({
      data: {
        title: args.title,
        content: args.content,
        authorId: user.id,
      },
    });

    return {
      userError: null,
      post: result,
    };
  },

  updatePost: async (
    parent: any,
    args: Partial<Post & { postId: string }>,
    { userInfo }: any
  ) => {
    if (!userInfo) {
      return {
        userError: "You are not authorized!",
        post: null,
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userInfo.userId,
      },
      include: {
        posts: true,
      },
    });

    if (!user) {
      return {
        userError: "User not found!",
        post: null,
      };
    }

    if (!user.posts.some((post) => post.id.includes(args.postId!))) {
      return {
        userError: "Post not belongs to you!",
        post: null,
      };
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: args.postId,
      },
      data: {
        title: args.title,
        content: args.content,
      },
    });

    return {
      userError: null,
      post: updatedPost,
    };
  },
};
