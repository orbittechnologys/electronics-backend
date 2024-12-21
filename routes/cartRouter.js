import express from "express";
import { addToCart, getAllCarts, getCartByCustomerId, getCartById } from "../controller/cartController.js";

const cartRouter = express.Router();

cartRouter.route("/addToCart").post(addToCart);
cartRouter.route("/getCartById/:cartId").get(getCartById);
cartRouter.route("/getAllCarts").get(getAllCarts);
cartRouter.route("/getCartByCustomerId/:customerId").get(getCartByCustomerId);


export default cartRouter;