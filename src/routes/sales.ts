import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import Sale from "../models/sale";
import Seller from "../models/seller";
import moment from "moment";

const getAllSales = publicProcedure.query(async () => {
  const sales = await Sale.find();
  return sales;
});

const getSaleBySeller = publicProcedure
  .input(
    z.object({
      seller: z.string() || undefined,
      date: z.string() || undefined,
    })
  )
  .query(async ({ input }) => {
    const sale = await Sale.find({
      seller: input?.seller,
      date: input?.date,
    }).populate({ path: "seller" });
    return sale;
  });

const getSaleByRange = publicProcedure
  .input(
    z.object({
      start: z.string(),
      end: z.string(),
      seller: z.string() || "",
    })
  )
  .query(async ({ input }) => {
    const { end, seller, start } = input;
    if (!end && !seller && !start) {
      return;
    }
    if (!seller) {
      if (start === end) {
        const sales = await Sale.find({ date: start })
          .populate({
            path: "seller",
          })
          .sort({ date: "asc" });
        return sales;
      }
      const sales = await Sale.find({
        date: {
          $gte: start,
          $lte: end,
        },
      })
        .populate({ path: "seller" })
        .sort({ date: "asc" });
      return sales;
    }
    if (start === end) {
      const sales = await Sale.find({
        date: start,
        seller: seller,
      })
        .populate({ path: "seller" })
        .sort({ date: "asc" });
      return sales;
    }
    const sales = await Sale.find({
      seller: seller,
      date: {
        $gte: start,
        $lte: end,
      },
    })
      .sort({ date: "asc" })
      .populate({ path: "seller" });

    return sales;
  });

const getSaleByRangeAndSeller = publicProcedure
  .input(
    z.object({
      start: z.string(),
      end: z.string(),
      seller: z.string(),
    })
  )
  .query(async ({ input }) => {
    if (input.seller) {
      const sales = await Sale.find({
        seller: input.seller,
        date: {
          $gte: input.start,
          $lte: input.end,
        },
      }).populate({ path: "seller" });
      return sales;
    }
    return;
  });

const getAllMonthSales = publicProcedure
  .input(
    z.object({
      start: z.string(),
      end: z.string(),
    })
  )
  .query(async ({ input }) => {
    const sales = await Sale.find({
      date: {
        $gte: input.start,
        $lte: input.end,
      },
    }).populate({ path: "seller" });

    const topNumber = moment(input.start).daysInMonth();
    let arr = [];

    for (let index = 1; index <= topNumber; index++) {
      const dateName = `${moment(input.start).format("YYYY")}-${moment(
        input.start
      ).format("MM")}-${index < 10 ? `0${index}` : index}`;
      let dateObj = { date: dateName, saldo: 0, total: 0, paga: 0, premios: 0 };

      sales.forEach((sale) => {
        if (sale.date === dateName) {
          dateObj = {
            ...dateObj,
            saldo: dateObj.saldo + parseFloat(sale.totals.saldo),
            total: dateObj.total + parseFloat(sale.totals.total),
            paga: dateObj.paga + parseFloat(sale.totals.paga),
            premios: dateObj.premios + parseFloat(sale.totals.premios),
          };
        }
      });
      arr.push(dateObj);
    }
    arr = arr.filter((item) => !!item.saldo);
    return arr;
  });

const getSalesWithDebts = publicProcedure
  .input(
    z.object({
      start: z.string(),
      end: z.string(),
    })
  )
  .query(async ({ input }) => {
    const sellers = await Seller.find();
    const sales = await Sale.find({
      date: {
        $gte: input.start,
        $lte: input.end,
      },
      status: -1,
    });
    const debts = sellers.map((seller) => {
      let obj = { seller, debt: 0 };
      const sale = sales.filter((s) => {
        return s.seller.toString() === seller._id.toString();
      });
      if (sale.length > 1) {
        sale.forEach((ss) => {
          obj = { ...obj, debt: obj.debt + parseFloat(ss.totals.saldo) };
        });
        return obj;
      }
      if (sale.length === 1) {
        obj = { ...obj, debt: obj.debt + parseFloat(sale[0].totals.saldo) };
        return obj;
      }
      return null;
    });
    const response = debts.filter((item) => !!item);
    return response;
  });

const getSalesByDay = publicProcedure
  .input(
    z.object({
      date: z.string(),
    })
  )
  .query(async ({ input }) => {
    const sales = await Sale.find({
      date: input.date,
    }).populate({ path: "seller" });
    return sales;
  });

const createSale = publicProcedure
  .input(
    z.object({
      date: z.string(),
      seller: z.string(),
      games: z.object({
        quiniela: z.string(),
        quini6: z.string(),
        loto: z.string(),
        loto5: z.string(),
        brinco: z.string(),
        poceada: z.string(),
        express: z.string(),
      }),
      totals: z.object({
        premios: z.string(),
        saldo: z.string(),
        paga: z.string(),
        total: z.string(),
        machineRent: z.boolean(),
      }),
      status: z.number(),
    })
  )
  .mutation(async ({ input }) => {
    const newSale = new Sale({
      date: input.date,
      seller: input.seller,
      games: input.games,
      totals: input.totals,
      status: input.status,
    });
    const savedSale = await newSale.save();
    return savedSale;
  });

const updateSale = publicProcedure
  .input(
    z.object({
      status: z.number(),
      id: z.string(),
      games: z.object({
        quiniela: z.string(),
        quini6: z.string(),
        loto: z.string(),
        loto5: z.string(),
        brinco: z.string(),
        poceada: z.string(),
        express: z.string(),
      }),
      totals: z.object({
        premios: z.string(),
        saldo: z.string(),
        paga: z.string(),
        total: z.string(),
        machineRent: z.boolean(),
      }),
    })
  )
  .mutation(async ({ input }) => {
    const updatedSale = await Sale.updateOne(
      { _id: input.id },
      { games: input.games, totals: input.totals, status: input.status }
    );
    return updatedSale;
  });

export const salesRouter = router({
  createSale,
  getAllSales,
  getSaleBySeller,
  getSalesByDay,
  updateSale,
  getSaleByRange,
  getSaleByRangeAndSeller,
  getSalesWithDebts,
  getAllMonthSales,
});
