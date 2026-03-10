import express from "express";
import { validate } from "../middlewares/validate.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { registerUserSchema, loginUserSchema } from "../schemas/user.schema";
import * as userController from "../controllers/user.controller";

const router = express.Router();

// Public route: Register
router.post(
  "/register",
  validate(registerUserSchema, "body"),
  userController.register,
);

// Public route: Login
router.post("/login", validate(loginUserSchema, "body"), userController.login);

// Protected route: Get all users
router.get("/", authenticate, userController.getUsers);

export default router;
