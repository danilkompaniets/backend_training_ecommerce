import { Router } from "express";
import authRoutes from "./auth";
import productRoutes from "./products";
import userRoutes from "./users";
import cartRoutes from "./cart";
import ordersRoutes from "./orders";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/products", productRoutes);
rootRouter.use("/adress", userRoutes);
rootRouter.use("/cart", cartRoutes);
rootRouter.use("/orders", ordersRoutes);

export default rootRouter;
