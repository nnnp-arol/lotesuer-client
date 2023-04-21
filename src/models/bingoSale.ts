import { Prop, modelOptions, getModelForClass } from "@typegoose/typegoose";
import { Schema, ZodDate } from "zod";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    versionKey: false,
  },
})
class BingoSale {
  @Prop({ type: Schema, ref: "Bingo" })
  bingo: string;
  @Prop({ type: Schema, ref: "Seller" })
  seller: string;
  @Prop({ type: String })
  sorteo: string;
  @Prop({ type: String })
  fecha_sorteo: string;
  @Prop({ type: String })
  juego: string;
  @Prop({ type: String })
  cartones: string;
  @Prop({ type: String })
  devolucion: string;
  @Prop({ type: String })
  paga: string;
  @Prop({ type: String })
  saldo: string;
}

export default getModelForClass(BingoSale);
