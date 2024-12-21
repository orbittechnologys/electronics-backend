import asyncHandler from "express-async-handler";
import {
  handleErrorResponse,
  handleNotFound,
} from "../utils/responseHandler.js";
import CustomerAddress from "../schemas/customerAddress.js";
import Customer from "../schemas/customerSchema.js";
import { findById } from "../manager/finder.js";

export const addAddress = asyncHandler(async (req, res) => {
  try {
    const {
      customer,
      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
      pincode,
    } = req.body;

    const existingCustomer = await findById(Customer, customer, res);
    if (!existingCustomer) return handleNotFound(res, "Customer", customer);

    // Check if all required fields are present
    if (
      !customer ||
      !addressLine1 ||
      !addressLine2 ||
      !landmark ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const addressDocs = await CustomerAddress.create({
      customer: customer,
      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
      pincode,
    });

    return res.status(200).json({ success: true, addressDocs });
  } catch (error) {
    console.log(error);
    return handleErrorResponse(res, error);
  }
});

export const getAddressByCustomerId = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id);
    const addressDocs = await CustomerAddress.find({ customer: id });

    console.log(addressDocs);
    return res.status(200).json({ success: true, addressDocs });
  } catch (error) {
    console.log(error);
    return handleErrorResponse(res, error);
  }
});

export const updateAddress = asyncHandler(async (req, res) => {
  try {
    const {
      addressId,
      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
      pincode,
    } = req.body;

    const existingCustomerAddress = await findById(
      CustomerAddress,
      addressId,
      [],
      "CustomerAddress",
      res
    );

    if (!existingCustomerAddress)
      return handleNotFound(res, "CustomerAddress", addressId);

    const addressDoc = await CustomerAddress.findByIdAndUpdate(
      { _id: addressId },
      {
        addressLine1: addressLine1 ?? existingCustomerAddress.addressLine1,
        addressLine2: addressLine2 ?? existingCustomerAddress.addressLine2,
        landmark: landmark ?? existingCustomerAddress.landmark,
        city: city ?? existingCustomerAddress.city,
        state: state ?? existingCustomerAddress.state,
        pincode: pincode ?? existingCustomerAddress.pincode,
      },
      { new: true }
    );

    return res.status(200).json({ success: true, addressDoc });
  } catch (error) {
    console.log(error);
    return handleErrorResponse(res, error);
  }
});

export const deleteAddress = asyncHandler(async (req, res) => {
  try {
    const addressId = req.params.addressId;

    const addressDocs = await CustomerAddress.findByIdAndDelete({
      _id: addressId,
    });

    if (!addressDocs) return handleNotFound(res, "CustomerAddress", addressId);

    return res
      .status(200)
      .json({ success: true, msg: "Address deleted suucessfully" });
  } catch (error) {
    console.log(error);
    return handleErrorResponse(res, error);
  }
});

export const getCustomerAddressById = asyncHandler(async (req, res) => {
  try {
    const { addressId } = req.params;

    const addressDocs = await findById(
      CustomerAddress,
      addressId,
      ["customer"],
      "CustomerAddress",
      res
    );

    if (!addressDocs) return handleNotFound(res, "CustomerAddress", addressId);

    return res.status(200).json({ success: true, addressDocs });
  } catch (error) {
    console.log(error);
    return handleErrorResponse(res, error);
  }
});
