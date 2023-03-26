import { config } from "dotenv";

config();

export const URL = !!process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}/trpc`
  : !!process.env.VITE_VERCEL_URL
  ? `https://${process.env.VITE_VERCEL_URL}/trpc`
  : `/trpc`;
