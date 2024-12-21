import asyncHandler from "express-async-handler";
import Categories from "../schemas/categoriesSchema.js";
import SubCategories from "../schemas/subCategorySchema.js";
import mongoose from "mongoose";
import {
  handleErrorResponse,
  handleNotFound,
  handleAlreadyExists,
} from "../utils/responseHandler.js";
import { findById, paginate } from "../manager/finder.js";
import Product from "../schemas/productSchema.js";

export const createSubCategory = asyncHandler(async (req, res) => {
  try {
    const { name, desc, category } = req.body;

    const categoryDoc = await findById(
      Categories,
      category,
      [],
      "Category",
      res
    );
    if (!categoryDoc) {
      return handleNotFound(res, "Category", category);
    }

    const subCategory = await SubCategories.create({
      name,
      desc,
      category,
    });

    return res.status(200).json({
      success: true,
      subCategory,
      msg: "Sub Category created successfully",
    });
  } catch (error) {
    console.log(error);
    return handleErrorResponse(res, error);
  }
});

export const deleteSubCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const subCategory = await SubCategories.findById(id);
    if (!subCategory) {
      return handleNotFound(res, "SubCategory", id);
    }

    const deletedProducts = await Product.deleteMany({
      subcategory: id,
    });

    console.log(`Deleted products count: ${deletedProducts.deletedCount}`);

    await SubCategories.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      msg: "SubCategory and related products deleted successfully",
      subCategory,
      deletedProductsCount: deletedProducts.deletedCount,
    });
  } catch (error) {
    console.error(error);
    return handleErrorResponse(res, error);
  }
});

export const fetchAllSubCategories = asyncHandler(async (req, res) => {
  try {
    const options = {
      page: req.query.page || 1,
      pageSize: req.query.pageSize || 10,
      sortField: req.query.sortField || "id",
      sortOrder: req.query.sortOrder || "desc",
    };

    const { documents: subCategories, pagination } = await paginate(
      SubCategories,
      {},
      options
    );

    return res.status(200).json({
      subCategories,
      pagination,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return handleErrorResponse(res, error);
  }
});

export const fetchSubCategoryById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const subCategory = await findById(
      SubCategories,
      id,
      [],
      "SubCategory",
      res
    );

    if (!subCategory) {
      return handleNotFound(res, "SubCategory", id);
    }

    return res.status(200).json({
      success: true,
      subCategory,
    });
  } catch (error) {
    console.error(error);
    return handleErrorResponse(res, error);
  }
});

export const updateSubCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { name, desc } = req.body;

    const subCategory = await SubCategories.findByIdAndUpdate(
      id,
      {
        name,
        desc,
      },
      { new: true }
    );

    if (!subCategory) {
      return handleNotFound(res, "subCategory", id);
    }

    return res.status(200).json({
      success: true,
      subCategory,
    });
  } catch (error) {
    console.error(error);
    return handleErrorResponse(res, error);
  }
});
