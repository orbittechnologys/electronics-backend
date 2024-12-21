import express from "express";
import { createProduct } from "../controller/productController.js";


const productRouter = express.Router();
productRouter.route("/create").post(createProduct);



export default productRouter;