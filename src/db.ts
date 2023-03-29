import { config } from "dotenv";
config();
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

export const dbConnect = async () => {
  try {
    mongoose.set("strictQuery", false);
    const db = await mongoose.connect(MONGODB_URI);
    console.log("db is connected to ", db.connection.db.databaseName);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
};
