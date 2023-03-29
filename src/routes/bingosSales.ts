import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import Bingo from "../models/bingo";
import moment from "moment";

const getAllBingosSales = publicProcedure.query(async () => {
  const bingosSales = await Bingo.find();
  return bingosSales;
});

export const salesRouter = router({
  getAllBingosSales,
});
