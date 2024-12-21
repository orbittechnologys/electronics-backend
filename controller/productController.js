import asyncHandler from "express-async-handler";
import Categories from "../schemas/categoriesSchema.js";
import SubCategories from "../schemas/subCategorySchema.js";
import Product from "../schemas/productSchema.js";
import mongoose from "mongoose";
import {
  handleErrorResponse,
  handleNotFound,
  handleAlreadyExists,
} from "../utils/responseHandler.js";
import { findById, paginate } from "../manager/finder.js";

export const createProduct = asyncHandler(async (req, res) => {
  try {
    const {
      category,
      subcategory,
      name,
      desc,
      bannerImage,
      color,
      prodImages,
      stock,
      price,
      inflatePrice,
      featureList,
    } = req.body;

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

    const subCategoryDoc = await findById(
      SubCategories,
      subcategory,
      [],
      "Sub Category",
      res
    );
    if (!subCategoryDoc) {
      return handleNotFound(res, "Sub Category", subcategory);
    }

    if (subCategoryDoc.category.toString() != category) {
      return res.status(400).json({
        msg: "Subcategory doesn't belong to this category",
      });
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
      featureList,
      status: "ACTIVE",
    });

    return res.status(200).json({
      success: true,
      product,
      msg: "Product created successfully",
    });
  } catch (error) {
    console.log(error);
    handleErrorResponse(res, error);
  }
});

export const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const options = {
      page: req.query.page || 1,
      pageSize: req.query.pageSize || 10,
      sortField: req.query.sortField || "id",
      sortOrder: req.query.sortOrder || "desc",
    };

    const { documents: products, pagination } = await paginate(
      Product,
      {},
      options
    );

    return res.status(200).json({
      products,
      pagination,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return handleErrorResponse(res, error);
  }
});

export const getProductById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const product = await findById(Product, id, [], "Product", res);
    if (!product) {
      return handleNotFound(res, "Product", id);
    }
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    return handleErrorResponse(res, error);
  }
});

export const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const {
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
      featureList,
      status,
    } = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      {
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
        featureList,
        status,
      },
      { new: true }
    );

    if (!product) {
      return handleNotFound(res, "Product", id);
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    return handleErrorResponse(res, error);
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return handleNotFound(res, "Product", id);
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    return handleErrorResponse(res, error);
  }
});

export const fetchProductsByCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const category = await findById(Categories, id, [], "Category", res);
    if (!category) {
      return handleNotFound(res, "Category", id);
    }

    const options = {
      page: req.query.page || 1,
      pageSize: req.query.pageSize || 10,
      sortField: req.query.sortField || "id",
      sortOrder: req.query.sortOrder || "desc",
    };

    const { documents: products, pagination } = await paginate(
      Product,
      { category: id },
      options
    );

    return res.status(200).json({
      products,
      pagination,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return handleErrorResponse(res, error);
  }
});
