import { Router } from "express";
import {
  addItemToCart,
  changeQty,
  deleteItemFromCart,
  getCart,
} from "../controllers/cart";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middleware/authMidleware";

const cartRoutes: Router = Router();

cartRoutes.post("/addItem", [authMiddleware], errorHandler(addItemToCart));

cartRoutes.delete(
  "/deleteItem/:id",
  [authMiddleware],
  errorHandler(deleteItemFromCart)
);

cartRoutes.get("/", [authMiddleware], errorHandler(getCart));

cartRoutes.put("/changeQty/:id", [authMiddleware], errorHandler(changeQty));

export default cartRoutes;
