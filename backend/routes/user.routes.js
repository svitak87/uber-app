import express from "express";
import {
  registerValidator,
  loginValidator,
} from "../validators/user.validator.js";
import { validate } from "../middlewares/user.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { userRegister, userLogin, getUserProfile } from "../controllers/user.controller.js";

export const userRouter = express.Router();

userRouter.post("/register", registerValidator, validate, userRegister);
userRouter.post("/login", loginValidator, validate, userLogin);
userRouter.get("/profile", authMiddleware, getUserProfile);
