import { publicProcedure, router } from "../trpc";
import { date, z } from "zod";
import AllSales from "../models/AllSales.model";
import Sale from "../models/sale";

const getAllAllSales = publicProcedure.query(async () => {
  const sales = await AllSales.find();
  return sales;
});

// const getSaleBySeller = publicProcedure
//   .input(
//     z.object({
//       seller: z.string() || undefined,
//       date: z.string() || undefined,
//     })
//   )
//   .query(async ({ input }) => {
//     const sale = await Sale.find({
//       seller: input?.seller,
//       date: input?.date,
//     }).populate({ path: "seller" });
//     return sale;
//   });

// const getSalesByDay = publicProcedure
//   .input(
//     z.object({
//       date: z.string(),
//     })
//   )
//   .query(async ({ input }) => {
//     const sales = await Sale.find({
//       date: input.date,
//     }).populate({ path: "seller" });
//     return sales;
//   });

const createAllSale = publicProcedure
  .input(
    z.object({
      day: z.string(),
      sale: z.object({
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
        }),
        status: z.number(),
      }),
    })
  )
  .mutation(async ({ input }) => {
    // const dateExist = await AllSales.findOneAndUpdate(
    //   {
    //     sales: {
    //       $elemMatch: {
    //         date: input.day,
    //       },
    //     },
    //   },
    //   { $set: { totals: input.sale.totals } }
    // );
    const dateExist = await AllSales.updateOne(
      //-> find and update
      { day: "2023-02-17", sales: { $elemMatch: { date: "2023-02-15" } } },
      { $set: { "sales.$.seller": "arol" } }
    );

    // const dateExist = await AllSales.find(
    // { day: "2023-02-17" },
    // {
    // day: "2023-02-17",
    // sales: {
    //   $elemMatch: {
    //     date: "2023-02-18",
    //   },
    // },
    // },
    // { sales: "2023-02-18" },
    // { seller: "asdasdasd" }
    // { $set: { totals: input.sale.totals } }
    // { $push: { sales: input.sale } }

    // console.log(dateExist);
    // return dateExist;
    // const newSales = new AllSales({
    //   day: input.day,
    //   sales: input.sale,
    // });
    // const savedSale = await newSales.save();
    // return savedSale;
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

export const allSalesRouter = router({
  createAllSale,
});
