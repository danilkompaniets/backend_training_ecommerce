import { Router } from "express";
import authMiddleware from "../middleware/authMidleware";
import {
  cancelOrder,
  createOrder,
  getOrderById,
  listOrders,
} from "../controllers/orders";
import { errorHandler } from "../error-handler";

const ordersRoutes: Router = Router();

ordersRoutes.post("/create", [authMiddleware], errorHandler(createOrder));
ordersRoutes.get("/", [authMiddleware], errorHandler(listOrders));
ordersRoutes.get("/:id", [authMiddleware], errorHandler(getOrderById));
ordersRoutes.put("/cancel/:id", [authMiddleware], errorHandler(cancelOrder));

export default ordersRoutes;
