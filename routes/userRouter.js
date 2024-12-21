import express from "express";
import { createAdmin, login } from "../controller/userController.js";

const userRouter = express.Router();

userRouter.route("/createAdmin").post(createAdmin);
userRouter.route("/login").post(login);

export default userRouter;