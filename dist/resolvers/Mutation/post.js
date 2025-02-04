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
exports.postResolvers = void 0;
const prisma_1 = require("../../prisma");
const checkUserAccess_1 = require("../../checkUserAccess");
exports.postResolvers = {
    createPost: (parent_1, args_1, _a) => __awaiter(void 0, [parent_1, args_1, _a], void 0, function* (parent, args, { userInfo }) {
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
        const result = yield prisma_1.prisma.post.create({
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
    }),
    updatePost: (parent_1, args_1, _a) => __awaiter(void 0, [parent_1, args_1, _a], void 0, function* (parent, args, { userInfo }) {
        const error = yield (0, checkUserAccess_1.checkUserAccess)(userInfo, args.postId);
        if (error) {
            return error;
        }
        const updatedPost = yield prisma_1.prisma.post.update({
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
    }),
    deletePost: (parent_1, args_1, _a) => __awaiter(void 0, [parent_1, args_1, _a], void 0, function* (parent, args, { userInfo }) {
        const error = yield (0, checkUserAccess_1.checkUserAccess)(userInfo, args.postId);
        if (error) {
            return error;
        }
        const deletedPost = yield prisma_1.prisma.post.delete({
            where: {
                id: args.postId,
            },
        });
        return {
            userError: null,
            post: deletedPost,
        };
    }),
};
