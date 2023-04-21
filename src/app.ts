import express from "express";
import morgan from "morgan";
import * as trpc from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { router, createContext } from "./trpc";
import { sellersRouter } from "./routes/seller";
import { salesRouter } from "./routes/sales";
import { bingoSalesRouter } from "./routes/bingoSales";
import { bingoRouter } from "./routes/bingo";
import { allGamesRouter } from "./routes/allGames";
import { UserRouter } from "./routes/user";
import { tokenRouter } from "./routes/token";
import cors from "cors";
import path from "path";
import favicon from "express-favicon";
import { authenticate } from "./middlewares/auth.middleware";

const app = express();

const appRouter = router({
  seller: sellersRouter,
  sale: salesRouter,
  bingoSale: bingoSalesRouter,
  bingo: bingoRouter,
  user: UserRouter,
  token: tokenRouter,
  allGames: allGamesRouter,
});

app.use(favicon(__dirname + "../client/public/lotesuer2.svg"));

app.use(cors());
app.use(morgan("dev"));

app.use(authenticate);

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
