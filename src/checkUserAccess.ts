import { prisma } from "./prisma";

export const checkUserAccess = async (
  userInfo: { userId: string },
  postId: string
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

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    return {
      userError: "Post not found!",
      post: null,
    };
  }

  //   if (!user.posts.some((post) => post.id.includes(postId!))) {
  //     return {
  //       userError: "Post not belongs to you!",
  //       post: null,
  //     };
  //   }
  if (user.id !== post.authorId) {
    return {
      userError: "Post not belongs to you!",
      post: null,
    };
  }
};
