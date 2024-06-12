import { Router } from "express";
import authMiddleware from "../middleware/authMidleware";
import adminMiddleware from "../middleware/adminMiddleware";
import { addAdress, updateUser } from "../controllers/users";
import { errorHandler } from "../error-handler";

const userRoutes: Router = Router();

userRoutes.post("/add", [authMiddleware], errorHandler(addAdress));
userRoutes.post("/update", [authMiddleware], errorHandler(updateUser));

export default userRoutes;
