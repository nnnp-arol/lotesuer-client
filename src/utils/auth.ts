import jwt from "jsonwebtoken";

export const createJsonJWT = (user: any) => {
  return jwt.sign({ user }, "unsecreto", { expiresIn: "1d" });
};
