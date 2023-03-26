import { config } from "dotenv";

config();

export const URL =
  `https://${process.env.VERCEL_URL}/trpc` ||
  `https://${process.env.VITE_VERCEL_URL}/trpc` ||
  `/trpc`;
