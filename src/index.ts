import { config } from "dotenv";
config();
import app from "./app";
import { dbConnect } from "./db";

const PORT = process.env.PORT || 4000;

dbConnect();
app.listen(PORT);

console.log("server on port", PORT);
