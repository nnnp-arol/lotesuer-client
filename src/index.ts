import app from "./app";
import { dbConnect } from "./db";
import { PORT } from "./config";

dbConnect();
app.listen(PORT);

console.log("server on port", PORT);
