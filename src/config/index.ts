import path from "path";
require("dotenv").config({ path: path.join(process.cwd(), ".env") });

export default {
  jwt_secret_token: process.env.JWT_SECRET_TOKEN,
};
