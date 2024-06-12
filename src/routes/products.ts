import { Router } from "express";
import { errorHandler } from "../error-handler";
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct,
} from "../controllers/products";
import authMiddleware from "../middleware/authMidleware";
import adminMiddleware from "../middleware/adminMiddleware";

const productRoutes: Router = Router();

productRoutes.post(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(createProduct)
);

productRoutes.put(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(updateProduct)
);

productRoutes.delete(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(deleteProduct)
);

productRoutes.get("/", errorHandler(listProducts));

productRoutes.get("/:id", errorHandler(getProductById));

export default productRoutes;
