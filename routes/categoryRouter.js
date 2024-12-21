import express from "express";
import { createCategory,  deleteCategory, fetchAllCategories, fetchCategoryById, getCategoryByName, updateCategory } from "../controller/categoryController.js";

const categoryRouter = express.Router();

categoryRouter.route("/create").post(createCategory);
categoryRouter.route("/getByName/:name").get(getCategoryByName);
categoryRouter.route("/getAll").get(fetchAllCategories);
categoryRouter.route("/getById/:id").get(fetchCategoryById);
categoryRouter.route("/update/:id").patch(updateCategory);
categoryRouter.route("/delete/:id").delete(deleteCategory);


export default categoryRouter;