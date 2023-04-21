import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import Bingo from "../models/bingo";
import BingoSale from "../models/bingoSale";
import moment from "moment";

const createBingoSale = publicProcedure
  .input(
    z.object({
      bingo: z.string(),
      seller: z.string(),
      fecha_sorteo: z.string(),
      sorteo: z.string(),
      juego: z.string(),
      cartones: z.string(),
      devolucion: z.string(),
      paga: z.string(),
      saldo: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    if (!input.bingo) throw new Error("Debe seleccionar un bingo");
    if (!input.seller) throw new Error("Debe seleccionar un vendedor");
    const existSale = await BingoSale.find({
      bingo: input.bingo,
      seller: input.seller,
      sorteo: input.sorteo,
    });
    if (existSale.length) throw new Error("Venta existente");
    const newSale = new BingoSale({
      fecha_sorteo: input.fecha_sorteo,
      bingo: input.bingo,
      seller: input.seller,
      sorteo: input.sorteo,
      juego: input.juego,
      cartones: input.cartones,
      devolucion: input.devolucion,
      saldo: input.saldo,
      paga: input.paga,
    });
    await newSale.save();
    return newSale;
  });

const getSaleByGameAndContest = publicProcedure
  .input(
    z.object({
      juego: z.string(),
      sorteo: z.string(),
    })
  )
  .query(async ({ input }) => {
    const bingoSales = await BingoSale.find({
      juego: input.juego,
      sorteo: input.sorteo,
    });
    return bingoSales;
  });

const getAllBingosByGame = publicProcedure
  .input(
    z.object({
      juego: z.string(),
      start: z.string(),
      end: z.string(),
    })
  )
  .query(async ({ input }) => {
    const { end, juego, start } = input;
    console.log(end, juego, start);
    if (!!input?.start) {
      const bingoSales = await BingoSale.find({
        fecha_sorteo: { $gte: input.start, $lte: input.end },
        juego: input.juego,
      });
      return bingoSales;
    }
    if (!!input?.juego) {
      const bingosSales = await BingoSale.find({ juego: input.juego });
      return bingosSales;
    }
    const bingosSales = await BingoSale.find();
    return bingosSales;
  });

const updateBingoSale = publicProcedure
  .input(
    z.object({
      id: z.string(),
      cartones: z.string(),
      devolucion: z.string(),
      paga: z.string(),
      saldo: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const foundSale = await BingoSale.updateOne(
      { _id: input.id },
      {
        cartones: input.cartones,
        devolucion: input.devolucion,
        saldo: input.saldo,
        paga: input.paga,
      }
    );
    return foundSale;
  });

export const bingoSalesRouter = router({
  getAllBingosByGame,
  createBingoSale,
  getSaleByGameAndContest,
  updateBingoSale,
});
