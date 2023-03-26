import { config } from "dotenv";

config();

export const URL = process.env.URL || "http://localhost:3000/trpc";
