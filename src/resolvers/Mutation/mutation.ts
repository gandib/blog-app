import { Post, User } from "@prisma/client";
import { authResolvers } from "./auth";
import { postResolvers } from "./post";

export const Mutation = {
  ...authResolvers,
  ...postResolvers,
};
