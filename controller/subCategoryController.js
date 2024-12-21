import asyncHandler from "express-async-handler";
import Categories from "../schemas/categoriesSchema.js";
import SubCategories from "../schemas/subCategorySchema.js";
import mongoose from "mongoose";
import { handleErrorResponse, handleNotFound, handleAlreadyExists } from "../utils/responseHandler.js";
import { findById, paginate } from "../manager/finder.js";

export const createSubCategory = asyncHandler(async (req,res) => {
    try {
        const { name, desc,category} = req.body;

        const categoryDoc = await findById(Categories,category,[],'Category',res);
        if(!categoryDoc){
            return handleNotFound(res,'Category',category);
        }

        const subCategory = await SubCategories.create({
            name,
            desc,
            category
        });

        return res.status(200).json({
            success:true,
            subCategory,
            msg:"Sub Category created successfully"
        });

    } catch (error) {
        console.log(error);
        return handleErrorResponse(res, error);
    }
})

