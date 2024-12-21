import express from "express";
import {
  addAddress,
  deleteAddress,
  getAddressByCustomerId,
  getCustomerAddressById,
  updateAddress,
} from "../controller/customerAddressController.js";

const customerAddressRouter = express.Router();

customerAddressRouter.route("/addAddress").post(addAddress);
customerAddressRouter.route("/getAddressByCustomerId/:id").get(getAddressByCustomerId);
customerAddressRouter.route("/updateAddress").patch(updateAddress);
customerAddressRouter.route("/deleteAddress/:addressId").delete(deleteAddress);
customerAddressRouter.route("/getAddressById/:addressId").get(getCustomerAddressById);

export default customerAddressRouter;
