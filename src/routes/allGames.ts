import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import BingoSale from "../models/bingoSale";
import Sale from "../models/sale";

const getAllGamesSales = publicProcedure
  .input(
    z.object({
      start: z.string(),
      end: z.string(),
      game: z.string(),
    })
  )
  .query(async ({ input }) => {
    const { start, game, end } = input;
    console.log(game, start, end);
    if (!game) {
      return { game: "", data: "" };
    }

    if (game === "quiniela") {
      if (!!end && !!start) {
        const sales = await Sale.find({
          date: {
            $gte: start,
            $lte: end,
          },
        }).populate({ path: "seller" });
        return { game, data: !!sales.length ? sales : "" };
      }
      const sales = await Sale.find({
        date: start,
      }).populate({ path: "seller" });
      return { game, data: !!sales.length ? sales : "" };
    }
    if (!!end && !!start) {
      const bingoSales = await BingoSale.find({
        fecha_sorteo: { $gte: start, $lte: end },
        juego: game,
      })
        .populate({ path: "seller" })
        .populate({ path: "bingo" });

      return { game, data: !!bingoSales.length ? bingoSales : "" };
    }
    const bingoSales = await BingoSale.find({
      fecha_sorteo: start,
      juego: game,
    })
      .populate({ path: "seller" })
      .populate({ path: "bingo" });

    return { game, data: !!bingoSales.length ? bingoSales : "" };
  });

export const allGamesRouter = router({
  getAllGamesSales,
});
