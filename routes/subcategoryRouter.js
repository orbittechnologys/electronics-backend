import express from "express";
import { createSubCategory } from "../controller/subCategoryController.js";

const subcategoryRouter = express.Router();
subcategoryRouter.route("/create").post(createSubCategory);

export default subcategoryRouter;