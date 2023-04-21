import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import Seller from "../models/seller";

const getSellers = publicProcedure
  .input(
    z.object({
      searchBy: z.string(),
    })
  )
  .query(async ({ input }) => {
    if (!!input.searchBy) {
      const convertSearch = parseInt(input.searchBy);
      if (convertSearch >= 0) {
        const sellers = await Seller.find({
          id_seller: { $regex: input.searchBy },
        });
        return sellers;
      }
      const sellers = await Seller.find({
        last_name: { $regex: input.searchBy },
      });
      return sellers;
    }
    const sellers = await Seller.find();
    return sellers;
  });

const createSeller = publicProcedure
  .input(
    z.object({
      id_seller: z.string(),
      name: z.string(),
      last_name: z.string(),
      dni: z.string(),
      phone: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const newSeller = new Seller({
      id_seller: input.id_seller,
      name: input.name,
      last_name: input.last_name,
      dni: input.dni,
      phone: input.phone,
    });
    const savedSeller = await newSeller.save();
    return savedSeller;
  });

const deleteSeller = publicProcedure
  .input(z.string())
  .mutation(async ({ input }) => {
    const notFound = await Seller.findByIdAndDelete(input);
    if (!notFound) throw new Error("seller not found");
    return true;
  });
const updateSellerPercent = publicProcedure
  .input(z.object({}))
  .mutation(async (props: any) => {
    await Seller.updateOne(
      { _id: props.input.value.id },
      {
        $set: {
          percent: props.input.value.percent,
        },
      }
    );
    return true;
  });

export const sellersRouter = router({
  get: getSellers,
  create: createSeller,
  delete: deleteSeller,
  updateSellerPercent,
});
