import express from "express";
import { createSubCategory, deleteSubCategory, fetchAllSubCategories, fetchSubCategoryById, updateSubCategory } from "../controller/subCategoryController.js";

const subcategoryRouter = express.Router();

subcategoryRouter.route("/create").post(createSubCategory);
subcategoryRouter.route("/getAll").get(fetchAllSubCategories);
subcategoryRouter.route("/getById/:id").get(fetchSubCategoryById);
subcategoryRouter.route("/delete/:id").delete(deleteSubCategory);
subcategoryRouter.route("/update/:id").patch(updateSubCategory);

export default subcategoryRouter;