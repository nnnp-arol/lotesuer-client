import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import Bingo from "../models/bingo";
import BingoSale from "../models/bingoSale";
import moment from "moment";

const createBingoSale = publicProcedure
  .input(
    z.object({
      deliver_date: z.string(),
      bingo: z.string(),
      seller: z.string(),
      contest_number: z.string(),
      game: z.string(),
      delivered_cards: z.string(),
      returned_cards: z.string(),
      sold: z.string(),
      balance: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    if (!input.bingo) throw new Error("Debe seleccionar un bingo");
    if (!input.seller) throw new Error("Debe seleccionar un vendedor");
    const existSale = await BingoSale.find({
      bingo: input.bingo,
      seller: input.seller,
      contest_number: input.contest_number,
    });
    if (existSale.length) throw new Error("Venta existente");
    const newSale = new BingoSale({
      deliver_date: input.deliver_date,
      bingo: input.bingo,
      seller: input.seller,
      contest_number: input.contest_number,
      game: input.game,
      delivered_cards: input.delivered_cards,
      returned_cards: input.returned_cards,
      sold: input.sold,
      balance: input.balance,
    });
    await newSale.save();
    return newSale;
  });

const getSaleByGameAndContest = publicProcedure
  .input(
    z.object({
      game: z.string(),
      contest_number: z.string(),
    })
  )
  .query(async ({ input }) => {
    const bingoSales = await BingoSale.find({
      game: input.game,
      contest_number: input.contest_number,
    });
    return bingoSales;
  });

const getAllBingosByGame = publicProcedure
  .input(
    z.object({
      game: z.string(),
      start: z.string(),
      end: z.string(),
    })
  )
  .query(async ({ input }) => {
    if (!!input?.start) {
      const bingoSales = await Bingo.find({
        date: { $gte: input.start, $lte: input.end },
        game: input.game,
      });
      return bingoSales;
    }
    if (!!input?.game) {
      const bingosSales = await Bingo.find({ game: input.game });
      return bingosSales;
    }
    const bingosSales = await Bingo.find();
    return bingosSales;
  });

export const bingoSalesRouter = router({
  getAllBingosByGame,
  createBingoSale,
  getSaleByGameAndContest,
});
