import asyncHandler from "express-async-handler";
import Feedback from "../schemas/feedbackSchema.js";
import Customer from "../schemas/customerSchema.js";
import Product from "../schemas/productSchema.js";
import { findAll, findById, findOne } from "../manager/finder.js";
import { handleErrorResponse, handleNotFound, handleAlreadyExists } from "../utils/responseHandler.js";
import mongoose from "mongoose";

export const createFeedback = asyncHandler(async (req, res) => {
  try {
    const { product, customer, rating, feedback, reviewImages } = req.body;

    if (!product || !customer || !rating) {
      return res.status(400).json({ success: false, msg: "Missing required fields" });
    }

    const customerExists = await findById(Customer, customer);
    if (!customerExists) {
      return handleNotFound(res, "Customer", customer);
    }

    const productExists = await findById(Product, product);
    if (!productExists) {
      return handleNotFound(res, "Product", product);
    }

    const feedbackDoc = await findOne(Feedback, { product, customer });

    let feedbackEntry;
    if (feedbackDoc) {

      feedbackEntry = feedbackDoc;
      feedbackEntry.feedback = feedback;
      feedbackEntry.rating = rating;
      feedbackEntry.reviewImages = reviewImages;
    } else {

      feedbackEntry = new Feedback({
        product,
        customer,
        feedback,
        rating,
        reviewImages,
      });
    }

    await feedbackEntry.save();

    const updatedRating = (productExists.rating + rating) / 2;
    productExists.rating = updatedRating;
    await productExists.save();

    return res.status(201).json({
      success: true,
      msg: "Feedback added successfully",
      feedback: feedbackEntry,
    });
  } catch (error) {
    console.error(error);
    return handleErrorResponse(res, error);
  }
});

export const findAllFeedbacks = asyncHandler(async (req, res) => {
  try {
    // Pass the field names to populate, not the models themselves
    const feedbacks = await findAll(Feedback, ["customer", "product"], "feedbacks", res);

    return res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    console.error(error);
    return handleErrorResponse(res, error);
  }
});

export const findFeedbackByProductId = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return handleNotFound(res, error, { msg: "Product ID is required" });
    }
    const feedbacks = await Feedback.find({ product: productId })
      .populate({
        path: "customer",
        populate: {
          path: "user",
        },
      })
      .populate("product", "name price  bannerImage desc");
    if (!feedbacks || feedbacks.length === 0) {
      return handleNotFound(res, error, { msg: "No feedback found for this product" });
    }

    return res.status(200).json({
      success: true,
      feedbacks
    });
  } catch (error) {
    console.error(error);
    return handleErrorResponse(res, error);
  }
});

export const findFeedbackByCustomerId = asyncHandler(async (req, res) => {
  try {
    const { customerId } = req.params;
    if (!customerId) {
      return handleNotFound(res, error, { msg: "Customer ID is required" });
    }
    const feedbacks = await Feedback.find({ customer: customerId })
      .populate({
        path: "customer",
        populate: {
          path: "user",
        },
      })
      .populate("product", "name price bannerImage desc");

    if (!feedbacks || feedbacks.length === 0) {
      return handleNotFound(res, error, { msg: "No feedback found for this product" });
    }

    return res.status(200).json({
      success: true,
      feedbacks
    });
  } catch (error) {
    console.error(error);
    return handleErrorResponse(res, error);
  }
});

export const fetchById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const feedbacks = await findById(Feedback, id, ['product', 'customer'], 'feedbacks', res);

    if (!feedbacks) return handleNotFound(res, "feedback", id);

    return res.status(200).json({
      success: true,
      feedbacks,
    });
  } catch (error) {
    console.log(error);
    return handleErrorResponse(res, error);
  }
});

export const updateFeedback = asyncHandler(async (req, res) => {
  try {
    const { feedbackId, rating, feedback, reviewImages } = req.body;

    if (!feedbackId) {
      return res.status(400).json({ success: false, msg: "Feedback ID is required" });
    }

    const feedbackDoc = await findById(Feedback, feedbackId, [], "feedback", res);

    if (!feedbackDoc) {
      return handleNotFound(res, null, { msg: "Feedback ID is not found" });
    }

    if (rating) feedbackDoc.rating = rating;
    if (feedback) feedbackDoc.feedback = feedback;
    if (reviewImages) feedbackDoc.reviewImages = reviewImages;

    await feedbackDoc.save();

    return res.status(200).json({
      success: true,
      msg: "Feedback updated successfully",
      feedback: feedbackDoc,
    });
  } catch (error) {
    console.error(error);
    return handleErrorResponse(res, error);
  }
});

export const deleteFeedback = asyncHandler(async (req, res) => {
  try {
    const { feedbackId } = req.body;

    if (!feedbackId) {
      return handleNotFound(res, error, { success: false, msg: "Feedback ID is required" });
    }

    const deletedFeedback = await Feedback.findByIdAndDelete(feedbackId);

    if (!deletedFeedback) {
      return handleNotFound(res, error, { success: false, msg: "Feedback not found" });
    }

    return res.status(200).json({
      success: true,
      msg: "Feedback deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return handleErrorResponse(res, error);
  }
});

export const getFeedbackByCustAndProdId = asyncHandler( async(req, res) => {
  try {
    const { productId, customerId } = req.query;

    if (!productId ||!customerId) {
      return res.status(400).json({ error: "Product ID and Customer ID are required" });
    }
    const feedback = await Feedback.findOne({ product: productId, customer: customerId })
    .populate("customer")
    .populate("product");

    if (!feedback) {
      return handleNotFound(res, 'Feedback', { success: false, msg: "No feedback found for this product and customer" });
    }

    return res.status(200).json({
      success: true,
      feedback,
    });
    
  } catch (error) {
    console.error(error);
    return handleErrorResponse(res, error);
  }
});

export const getRatingCounts = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    return res.status(400).json({ error: "Product ID is required" });
  }
  try {
    const ratingCounts = await Feedback.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId), 
        },
      },
      {
        $group: {
          _id: "$rating", 
          count: { $sum: 1 }, 
        },
      },
    ]);
    //default counts are 0
    const result = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratingCounts.forEach(({ _id, count }) => {
      result[_id] = count;
    });

    res.status(200).json({ productId, ratingCounts: result });
  } catch (error) {
    console.error("Error fetching rating counts:", error);
    return handleErrorResponse(res, error);
  }
});