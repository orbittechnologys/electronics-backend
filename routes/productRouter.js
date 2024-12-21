import express from "express";
import {
  createProduct,
  deleteProduct,
  fetchAllProducts,
  fetchProductsByCategory,
  getProductById,
  updateProduct,
} from "../controller/productController.js";
import { get } from "https";

const productRouter = express.Router();
productRouter.route("/create").post(createProduct);
productRouter.route("/getAll").get(fetchAllProducts);
productRouter.route("/getById/:id").get(getProductById);
productRouter.route("/delete/:id").delete(deleteProduct);
productRouter.route("/update/:id").patch(updateProduct);
productRouter.route("/getByCategory/:id").get(fetchProductsByCategory);

export default productRouter;
