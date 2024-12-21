import asyncHandler from "express-async-handler";
import Categories from "../schemas/categoriesSchema.js";
import mongoose from "mongoose";
import { handleErrorResponse, handleNotFound, handleAlreadyExists } from "../utils/responseHandler.js";
import { findById, paginate } from "../manager/finder.js";


export const createCategory = asyncHandler(async (req, res) => {
    try {
      const { name, desc,roundBannerImage} = req.body;
    
      const categoryExists = await Categories.findOne({ name });
  
      if (categoryExists) {
        return handleAlreadyExists(res, "Category", name);
      }
  
      if(!roundBannerImage){
        return res.status(400).json({
          msg:"Atleast one banner image required"
        });
      }
  
      const category = await Categories.create({
        name,
        desc,
        roundBannerImage
      });
  
      return res.status(200).json({
        success: true,
        msg: "Category created successfully",
        category,
      });
    } catch (error) {
      console.log(error);
      return handleErrorResponse(res, error);
    }
  });
  
  export const getCategoryByName = asyncHandler(async (req, res) => {
    try {
      const { name } = req.params;
  
      const category = await Categories.find({
        name: { $regex: name, $options: "i" },
      });
  
      if (!category || category.length === 0) {
        return handleNotFound(res, "Category",name);
      }
  
      return res.status(200).json({
        success: true,
        categories: category,
      });
    } catch (error) {
      console.log(error);
      return handleErrorResponse(res, error);
    }
  });
  
  export const fetchAllCategories = asyncHandler(async (req, res) => {
    try {
      const options = {
        page: req.query.page,
        pageSize: req.query.pageSize,
        sortField: req.query.sortField || "id",
        sortOrder: req.query.sortOrder || "desc",
      };
  
      const { documents: categories, pagination } = await paginate(
        Categories,
        {},
        options
      );
  
      return res.status(200).json({
        categories,
        pagination,
        success: true,
      });
    } catch (error) {
      console.log(error);
      return handleErrorResponse(res, error);
    }
  });
  
  export const fetchCategoryById = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const category = await findById(Categories, id, [], "Category", res);
  
      if (!category) {
        return handleNotFound(res, "Category", id);
      }
  
      return res.status(200).json({
        success: true,
        category,
      });
    } catch (error) {
      console.log(error);
      return handleErrorResponse(res, error);
    }
  });
  
  export const updateCategory = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { name, desc ,roundBannerImage} = req.body;
  
      const category = await Categories.findByIdAndUpdate(
        id,
        {
          name,
          desc,
          roundBannerImage
        },
        { new: true }
      );
  
      if (!category) {
        return handleNotFound(res,"category",id);
      }
  
      return res.status(200).json({
        success: true,
        category,
      });
    } catch (error) {
      console.log(error);
      return handleErrorResponse(res, error);
    }
  });
  
  export const deleteCategory = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Categories.findByIdAndDelete(id);
  
      if (!category) {
        return handleNotFound(res, "Category", id);
      }
  
      return res.status(200).json({
        success: true,
        msg: "Category deleted successfully",
        category,
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      return handleErrorResponse(res, error);
    }
  });