import asyncHandler from "express-async-handler";
import Categories from "../schemas/categoriesSchema.js";
import SubCategories from "../schemas/subCategorySchema.js";
import Product from "../schemas/productSchema.js";
import mongoose from "mongoose";
import { handleErrorResponse, handleNotFound, handleAlreadyExists } from "../utils/responseHandler.js";
import { findById, paginate } from "../manager/finder.js";


export const createProduct = asyncHandler(async (req,res) => {
    try {
        const {category,subcategory, name, desc, bannerImage, color, prodImages, stock, price, inflatePrice,featureList } = req.body;


        const categoryDoc = await findById(Categories, category,[], 'Category',res);
        if(!categoryDoc){
            return handleNotFound(res,'Category',category);
        }

        const subCategoryDoc = await findById(SubCategories,subcategory,[],'Sub Category',res);
        if(!subCategoryDoc){
            return handleNotFound(res,'Sub Category',subcategory)
        }

        if(subCategoryDoc.category.toString() != category ){
            return res.status(400).json({
                msg:"Subcategory doesn't belong to this category"
            })
        }

        const product = await Product.create({
            name,
            desc,
            category,
            subcategory,
            bannerImage,
            color,
            prodImages,
            stock,
            price,
            inflatePrice,
            featureList
        });

        return res.status(200).json({
            success:true,
            product,
            msg:"Product created successfully"
        });

    } catch (error) {
        console.log(error);
        handleErrorResponse(res,error);
    }
})