import jwt, { Secret } from "jsonwebtoken";
import config from "../config";

export const generateToken = async (
  payload: { userId: string },
  secret: Secret
) => {
  return jwt.sign(payload, secret, {
    expiresIn: "1d",
  });
};

export const getUserInfoFromToken = async (token: string) => {
  const userData = jwt.verify(token, config.jwt_secret_token as string) as {
    userId: string;
  };
  return userData;
};
