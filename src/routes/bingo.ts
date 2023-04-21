import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import Bingo from "../models/bingo";
import BingoSale from "../models/bingoSale";
import moment from "moment";

const getBingos = publicProcedure
  .input(
    z.object({
      juego: z.string(),
    })
  )
  .query(async ({ input }) => {
    if (!!input.juego) {
      const bingos = await Bingo.find({ juego: input.juego });
      return bingos;
    }
    const bingos = await Bingo.find();
    return bingos;
  });

const deleteBingo = publicProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const deletedBingo = await Bingo.findByIdAndDelete({ _id: input.id });
    return deletedBingo;
  });

const createBingo = publicProcedure
  .input(
    z.object({
      fecha_sorteo: z.string(),
      sorteo: z.string(),
      precio: z.string(),
      juego: z.string(),
      cartones: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const existBingo = await Bingo.find({
      juego: input.juego,
      sorteo: input.sorteo,
    });
    if (Object.values(input).some((item) => !item)) {
      throw new Error("formulario incompleto");
      return;
    }
    if (existBingo.length) throw new Error("Numero de sorteo existente");
    const newBingo = new Bingo({
      fecha_sorteo: input.fecha_sorteo,
      sorteo: input.sorteo,
      precio: input.precio,
      juego: input.juego,
      cartones: input.cartones,
    });
    const savedBingo = await newBingo.save();
    return savedBingo;
  });

export const bingoRouter = router({
  create: createBingo,
  get: getBingos,
  delete: deleteBingo,
});
