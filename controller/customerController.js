
import bcrypt from "bcryptjs";
import User from "../schemas/userSchema.js";
import Customer from "../schemas/customerSchema.js";
import asyncHandler from "express-async-handler";
import { findById, findByUserId, paginate } from "../manager/finder.js";
import {
  handleErrorResponse,
  handleNotFound,
} from "../utils/responseHandler.js";


export const onboardCustomer = asyncHandler(async (req, res) => {
    try {
      const { firstName, lastName, gender, email, password } = req.body;
  
      let user = await User.findOne({ email });
      if (user) {
        console.log(`User already exists for customer for email: ${email}`);
        return res.status(400).json({
          success: false,
          msg: `User already exists for customer for email: ${email}`,
        });
      }
  
      user = await User.create({
        email,
        username: `${firstName} ${lastName}`,
        password,
        role: "CUSTOMER",
      });
  
      const customer = await Customer.create({
        firstName,
        lastName,
        gender,
        user: user._id,
      });
  
      return res.status(200).json({
        success: true,
        customer,
        user,
        msg: "Customer onboarded successfully",
      });
    } catch (error) {
      console.log(error);
      return handleErrorResponse(res, error);
    }
  });


  export const fetchCustomerById = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
  
      const customer = await findById(Customer, id, ["user"], "Customer", res);
  
      if (!customer) return handleNotFound(res, "Customer", id);
  
      return res.status(200).json({
        success: true,
        customer,
      });
    } catch (error) {
      console.log(error);
      return handleErrorResponse(res, error);
    }
  });
  
  export const fetchCustomerByUserId = asyncHandler(async (req, res) => {
    try {
      const { userId } = req.params;
  
      const customer = await findByUserId(Customer, userId, "Customer", res);
  
      if (!customer) return handleNotFound(res, "Customer", userId);
  
      return res.status(200).json({
        success: true,
        customer,
      });
    } catch (error) {
      console.log(error);
      return handleErrorResponse(res, error);
    }
  });

  export const fetchAllCustomers = asyncHandler(async (req, res) => {
    try {
      const options = {
        page: req.query.page,
        pageSize: req.query.pageSize,
        sortField: req.query.sortField || "dateCreated",
        sortOrder: req.query.sortOrder || "desc",
        populateFields: ["user"],
      };
  
      const { documents: customers, pagination } = await paginate(
        Customer,
        {},
        options
      );
  
      return res.status(200).json({
        customers,
        pagination,
        success: true,
      });
    } catch (error) {
      console.log(error);
      return handleErrorResponse(res, error);
    }
  });