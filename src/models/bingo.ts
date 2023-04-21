import { Prop, modelOptions, getModelForClass } from "@typegoose/typegoose";
import { Schema, ZodDate } from "zod";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    versionKey: false,
  },
})
class Bingo {
  @Prop({ type: String })
  fecha_sorteo: string;
  @Prop({ type: String })
  sorteo: string;
  @Prop({ type: String })
  precio: string;
  @Prop({ type: String })
  juego: string;
  @Prop({ type: String })
  cartones: string;
}

export default getModelForClass(Bingo);
