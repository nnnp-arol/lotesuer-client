import jwt from "jsonwebtoken";

export const authenticate = (req: any, res: any, next: any) => {
  if (
    req.url === "/trpc/user.login?batch=1" ||
    req.url === "/trpc/user.createUser?batch=1"
  ) {
    return next();
  }
  const token = req.headers.authorization;
  if (!token) {
    console.log("no hay token");
    throw new Error("token super invalido");
  }
  const verified = jwt.verify(token, "unsecreto");
  if (!verified) {
    console.log("token invalido");
    throw new Error("token super invalido");
  }
  next();
};
