import { Prop, modelOptions, getModelForClass } from "@typegoose/typegoose";
import { Schema } from "zod";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    versionKey: false,
  },
})
class Ventas {
  @Prop({ type: String })
  date: string;
  @Prop({ type: Schema, ref: "Seller" })
  seller: string;
  @Prop({ type: String })
  quiniela: string;
  @Prop({ type: String })
  quini6: string;
  @Prop({ type: String })
  loto: string;
  @Prop({ type: String })
  loto5: string;
  @Prop({ type: String })
  brinco: string;
  @Prop({ type: String })
  poceada: string;
  @Prop({ type: String })
  express: string;
  @Prop({ type: String })
  premios: string;
  @Prop({ type: String })
  saldo: string;
  @Prop({ type: String })
  paga: string;
  @Prop({ type: String })
  total: string;
}

export default getModelForClass(Ventas);
