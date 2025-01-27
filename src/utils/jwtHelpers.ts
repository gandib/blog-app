import jwt, { Secret } from "jsonwebtoken";

export const generateToken = async (
  payload: { userId: string },
  secret: Secret
) => {
  return jwt.sign(payload, secret, {
    expiresIn: "1d",
  });
};
