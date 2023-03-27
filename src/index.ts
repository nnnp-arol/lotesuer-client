import { config } from "dotenv";
config();
import app from "./app";
import { dbConnect } from "./db";
// import { PORT } from "./config";

dbConnect();
app.listen(process.env.PORT);

console.log("server on port", process.env.PORT);
