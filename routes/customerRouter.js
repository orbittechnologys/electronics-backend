import express from "express";
import { onboardCustomer, fetchCustomerById, fetchCustomerByUserId, fetchAllCustomers} from "../controller/customerController.js";

const customerRouter = express.Router();

customerRouter.route("/onboard").post(onboardCustomer);
customerRouter.route("/getById/:id").get(fetchCustomerById);
customerRouter.route("/getByUserId/:userId").get(fetchCustomerByUserId);
customerRouter.route("/getAll").get(fetchAllCustomers);

export default customerRouter;