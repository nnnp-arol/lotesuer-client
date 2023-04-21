import { Prop, modelOptions, getModelForClass } from "@typegoose/typegoose";
import { boolean } from "zod";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    versionKey: false,
  },
})
class Seller {
  @Prop({ type: String, unique: true })
  id_seller: string;
  @Prop({ type: String, unique: true })
  machine_number: string;
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  last_name: string;

  @Prop({ type: String })
  dni: string;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: String })
  address: string;

  @Prop({
    type: Object,
    default: {
      quiniela: "11",
      quini6: "11",
      loto: "11",
      loto5: "11",
      brinco: "11",
      express: "11",
      poceada: "11",
      telekino: "11",
      telebingo: "11",
      super15: "11",
      machineRent: "3.5",
      otro: "11",
    },
    required: false,
  })
  percent: {
    quiniela: string;
    quini6: string;
    loto: string;
    loto5: string;
    brinco: string;
    express: string;
    poceada: string;
    telekino: string;
    telebingo: string;
    super15: string;
    machineRent: string;
    otro: string;
  };
}

export default getModelForClass(Seller);
