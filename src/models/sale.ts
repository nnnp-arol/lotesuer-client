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
  date: string;
  @Prop({ type: ZodDate, required: false })
  unix_date: Date;
  @Prop({ type: Schema, ref: "Seller" })
  seller: string;
  @Prop({
    type: Object,
    default: {
      quiniela: "0.00",
      quini6: "0.00",
      loto: "0.00",
      loto5: "0.00",
      brinco: "0.00",
      poceada: "0.00",
      express: "0.00",
    },
  })
  games: {
    quiniela: string;
    quini6: string;
    loto: string;
    loto5: string;
    brinco: string;
    poceada: string;
    express: string;
  };

  @Prop({
    type: Object,
    default: {
      premios: "0.00",
      saldo: "0.00",
      paga: "0.00",
      total: "0.00",
      machineRent: true,
    },
  })
  totals: {
    premios: string;
    saldo: string;
    paga: string;
    total: string;
    machineRent: boolean;
  };
  @Prop({ type: Number, default: 0, required: false })
  status: number;
}

export default getModelForClass(Sale);
