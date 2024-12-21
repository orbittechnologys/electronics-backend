import User from "../schemas/userSchema.js";
import Customer from "../schemas/customerSchema.js";
import asyncHandler from "express-async-handler";
import {
    handleNotFound,
    handleErrorResponse,
  } from "../utils/responseHandler.js";
import { findById } from "../manager/finder.js";


export const createAdmin = asyncHandler(async (req, res) => {
    try {
      const { email, phone, username, password } = req.body;
  
      let userDoc = await User.findOne({ email });
      if (userDoc) {
        console.log("Already existing email/phone", email);
        return res.status(400).json({
          success: false,
          msg: `Already existing email/phone: ${email}`,
        });
      }
  
      userDoc = await User.create({
        username,
        email,
        phone,
        password,
        role: "ADMIN",
      });
  
      return res.status(200).json({
        success: true,
        userDoc,
      });
    } catch (error) {
      console.error(error);
      return handleErrorResponse(res, error);
    }
  });


  export const login = asyncHandler(async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return handleNotFound(res, "User", email);
      }
  
      if (await user.matchPassword(password)) {
        if (user.role === "CUSTOMER") {
          const customer = await Customer.findOne({ user: user._id });
  
          if (!customer) {
            return handleNotFound(res, "Customer", email);
          }
  
          return res.status(200).json({
            success: true,
            msg: "Logged in successfully",
            user: {
              id: user._id,
              username: user.username,
              email: user.email,
              role: user.role,
            },
            customer: {
              id: customer._id,
              firstName: customer.firstName,
              lastName: customer.lastName,
              totalProductsBought: customer.totalProductsBought,
              totalPurchase: customer.totalPurchase,
              gender:customer.gender
            },
          });
        }
  
        return res.status(200).json({
          success: true,
          msg: "Logged in successfully",
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
        });
      } else {
        return res
          .status(400)
          .json({ success: false, msg: "Incorrect password." });
      }
    } catch (error) {
      console.error(error);
      return handleErrorResponse(res, error);
    }
  });