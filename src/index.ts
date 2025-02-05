// /Users/danil/Desktop/ecommerce/backend/src/index.ts
import express, { Express, Request, Response, Router } from "express";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middleware/errors";
import { SignupSchema } from "./schema/users";

const app: Express = express();
app.use(express.json());
app.use(errorMiddleware);

console.log(process.env.DATABASE_URL);

export const prismaClient = new PrismaClient({
  log: ["query"],
}).$extends({
  result: {
    adress: {
      formattedAddress: {
        needs: {
          lineOne: true,
          lineTwo: true,
          city: true,
          country: true,
          pincode: true,
        },
        compute: (addr) => {
          return `${addr.lineOne}, ${addr.lineTwo}, ${addr.city}, ${addr.country}-${addr.pincode}`;
        },
      },
    },
  },
});

app.use("/api", rootRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Working");
});

app.listen(3000, () => {
  console.log("server started");
});

