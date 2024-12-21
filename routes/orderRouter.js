import express from "express";
import { checkoutCart, getAllOrders, getOrderByCustomerById, getOrderById } from "../controller/orderController.js";


const orderRouter = express.Router();
orderRouter.route("/checkout").post(checkoutCart);
orderRouter.route("/getOrderById/:orderId").get(getOrderById);
orderRouter.route("/getAllOrders").get(getAllOrders);
orderRouter.route("/getOrderByCustomerById/:customerId").get(getOrderByCustomerById);


export default orderRouter;