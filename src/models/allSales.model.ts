import { Prop, modelOptions, getModelForClass } from "@typegoose/typegoose";
import mongoose from "mongoose";

const { Schema } = mongoose;
@modelOptions({
  schemaOptions: {
    timestamps: true,
    versionKey: false,
  },
})
class AllSales {
  @Prop({ type: String, unique: true, required: true })
  day: string;
  @Prop({ type: Array })
  sales: [];
}

export default getModelForClass(AllSales);
