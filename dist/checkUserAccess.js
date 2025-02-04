"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserAccess = void 0;
const prisma_1 = require("./prisma");
const checkUserAccess = (userInfo, postId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userInfo) {
        return {
            userError: "You are not authorized!",
            post: null,
        };
    }
    const user = yield prisma_1.prisma.user.findUnique({
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
    const post = yield prisma_1.prisma.post.findUnique({
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
});
exports.checkUserAccess = checkUserAccess;
