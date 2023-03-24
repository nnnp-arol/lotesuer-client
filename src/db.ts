import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    mongoose.set("strictQuery", false);
    const db = await mongoose.connect(
      "mongodb+srv://arolalonso:asdqwe123DEV@cluster0.kabyj3b.mongodb.net/lotesuer?retryWrites=true&w=majority"
    );
    console.log("db is connected to ", db.connection.db.databaseName);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
};
