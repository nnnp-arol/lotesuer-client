import { Prop, modelOptions, getModelForClass } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    versionKey: false,
  },
})
class User {
  @Prop({ type: String, unique: true, required: true })
  user_name: string;
  @Prop({ type: String, required: true })
  password: string;
}

export default getModelForClass(User);
