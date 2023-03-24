import express from "express";
import morgan from "morgan";
import * as trpc from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { router, createContext } from "./trpc";
import { sellersRouter } from "./routes/seller";
import { salesRouter } from "./routes/sales";
import cors from "cors";
import path from "path";

const app = express();

const appRouter = router({
  seller: sellersRouter,
  sale: salesRouter,
});

app.use(cors());
app.use(morgan("dev"));

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.use(express.static(path.join(__dirname, "../client/dist")));

export type AppRouter = typeof appRouter;

export default app;
