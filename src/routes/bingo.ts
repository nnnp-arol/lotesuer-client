import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import Bingo from "../models/bingo";
import BingoSale from "../models/bingoSale";
import moment from "moment";

const getBingos = publicProcedure
  .input(
    z.object({
      game: z.string(),
    })
  )
  .query(async ({ input }) => {
    if (!!input.game) {
      const bingos = await Bingo.find({ game: input.game });
      return bingos;
    }
    const bingos = await Bingo.find();
    return bingos;
  });

const createBingo = publicProcedure
  .input(
    z.object({
      contest_date: z.string(),
      contest_number: z.string(),
      price: z.string(),
      game: z.string(),
      cards: z.string(),
      returned_cards: z.string(),
      dealt_cards: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const existBingo = await Bingo.find({
      game: input.game,
      contest_number: input.contest_number,
    });
    console.log(existBingo);
    if (Object.values(input).some((item) => !item))
      throw new Error("formulario incompleto");
    if (existBingo.length) throw new Error("Numero de sorteo existente");
    const newBingo = new Bingo({
      contest_date: input.contest_date,
      contest_number: input.contest_number,
      price: input.price,
      game: input.game,
      cards: input.cards,
      returned_cards: input.returned_cards,
      dealt_cards: input.dealt_cards,
    });
    const savedBingo = await newBingo.save();
    return savedBingo;
  });

export const bingoRouter = router({
  create: createBingo,
  get: getBingos,
});
