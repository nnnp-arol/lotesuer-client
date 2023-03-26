import { config } from "dotenv";

config();

export const PORT = process.env.PORT;
export const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://arolalonso:asdqwe123DEV@cluster0.kabyj3b.mongodb.net/lotesuer?retryWrites=true&w=majority";
