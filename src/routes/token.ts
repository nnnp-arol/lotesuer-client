import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import jwt from "jsonwebtoken";

const verifyToken = publicProcedure
  .input(
    z.object({
      token: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const token = input.token;
    if (!token) {
      console.log("no token");
      return false;
    }
    const verified = jwt.verify(token, "unsecreto");
    if (!verified) {
      console.log("invalid token");
      return false;
    }
    return true;
  });

export const tokenRouter = router({
  verifyToken,
});
