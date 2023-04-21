import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import User from "../models/user";
import { createJsonJWT } from "../utils/auth";
import bcrypt from "bcryptjs";

const createUser = publicProcedure
  .input(
    z.object({
      user_name: z.string(),
      password: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const encryptPassword = await bcrypt.hash(input.password, 8);
    const newUser = new User({
      user_name: input.user_name,
      password: encryptPassword,
    });
    await newUser.save();
    const securedUser = { _id: newUser._id, user_name: newUser.user_name };

    const token = createJsonJWT(securedUser);

    return { user: securedUser, token };
  });

const login = publicProcedure
  .input(
    z.object({
      user_name: z.string(),
      password: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const foundUser = await User.findOne({
      user_name: input.user_name,
    });
    if (!foundUser) throw new Error("nombre de usuario o password incorrecto ");
    const passwordCompared = await bcrypt.compare(
      input.password,
      foundUser.password
    );
    if (!passwordCompared)
      throw new Error("nombre de usuario o password incorrecto ");

    const securedUser = { _id: foundUser._id, user_name: foundUser.user_name };

    const token = createJsonJWT(securedUser);
    return { user: securedUser, token };
  });

export const UserRouter = router({
  createUser,
  login,
});
