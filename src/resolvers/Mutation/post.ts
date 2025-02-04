import { Post } from "@prisma/client";
import { prisma } from "../../prisma";
import { checkUserAccess } from "../../checkUserAccess";

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
    const error = await checkUserAccess(userInfo, args.postId!);

    if (error) {
      return error;
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

  deletePost: async (
    parent: any,
    args: { postId: string },
    { userInfo }: any
  ) => {
    const error = await checkUserAccess(userInfo, args.postId);

    if (error) {
      return error;
    }

    const deletedPost = await prisma.post.delete({
      where: {
        id: args.postId,
      },
    });

    return {
      userError: null,
      post: deletedPost,
    };
  },

  publishPost: async (
    parent: any,
    args: Partial<Post & { postId: string }>,
    { userInfo }: any
  ) => {
    const error = await checkUserAccess(userInfo, args.postId!);

    if (error) {
      return error;
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: args.postId,
      },
      data: {
        published: true,
      },
    });

    return {
      userError: null,
      post: updatedPost,
    };
  },
};
