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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtHelpers_1 = require("../utils/jwtHelpers");
const config_1 = __importDefault(require("../config"));
const prisma = new client_1.PrismaClient();
exports.resolvers = {
    Query: {
        user: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.user.findUniqueOrThrow({
                where: {
                    id: args.userId,
                },
            });
        }),
        users: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.user.findMany();
        }),
    },
    Mutation: {
        signup: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({
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
            const hashedPassword = yield bcrypt_1.default.hash(args.password, 12);
            args.password = hashedPassword;
            const createUser = yield prisma.user.create({
                data: {
                    name: args.name,
                    email: args.email,
                    password: args.password,
                },
            });
            if (args.bio) {
                yield prisma.profile.create({
                    data: {
                        bio: args.bio,
                        userId: createUser.id,
                    },
                });
            }
            const token = yield (0, jwtHelpers_1.generateToken)({ userId: createUser.id }, config_1.default.jwt_secret_token);
            return {
                token,
            };
        }),
        signin: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({
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
            const verifyPassword = yield bcrypt_1.default.compare(args.password, user === null || user === void 0 ? void 0 : user.password);
            if (!verifyPassword) {
                return {
                    userError: "User credentials is incorrect!",
                    token: null,
                };
            }
            const token = yield (0, jwtHelpers_1.generateToken)({ userId: user.id }, config_1.default.jwt_secret_token);
            return {
                userError: null,
                token,
            };
        }),
        createPost: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield prisma.user.findUniqueOrThrow({
                where: {
                    id: args.authorId,
                },
            });
            // if (!user) {
            // }
            return yield prisma.post.create({
                data: {
                    title: args.title,
                    content: args.content,
                    authorId: user.id,
                },
            });
        }),
    },
};
