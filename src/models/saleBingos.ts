import { Prop, modelOptions, getModelForClass } from "@typegoose/typegoose";
import { Schema, ZodDate } from "zod";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    versionKey: false,
  },
})
class Sale {
  @Prop({ type: String })
  deliver_date: string;
  @Prop({ type: Schema, ref: "Bingo" })
  bingo: string;
  @Prop({ type: Schema, ref: "Seller" })
  seller: string;
  @Prop({ type: String })
  delivered_cards: string;
  @Prop({ type: String })
  returned_cards: string;
  @Prop({ type: String })
  sold: string;
}

export default getModelForClass(Sale);
