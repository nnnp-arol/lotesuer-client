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
  contest_date: string;
  @Prop({ type: String })
  contest_number: string;
  @Prop({ type: String })
  price: string;
  @Prop({ type: String })
  game: string;
  @Prop({ type: String })
  cards: string;
}

export default getModelForClass(Bingo);
