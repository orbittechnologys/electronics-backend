import asyncHandler from "express-async-handler";
import {
  handleErrorResponse,
  handleNotFound,
} from "../utils/responseHandler.js";
import { findById, paginate } from "../manager/finder.js";
import Order from "../schemas/orderSchema.js";
import Cart from "../schemas/cartSchema.js";
import Customer from "../schemas/customerSchema.js";
import CustomerAddress from "../schemas/customerAddress.js";
import Product from "../schemas/productSchema.js";

export const checkoutCart = asyncHandler(async (req, res) => {
    try {
      const { cart, customerId, customerAddressId, paymentId } = req.body;
  
      const cartDoc = await findById(Cart, cart, ["items.product"], "Cart", res);
      if (!cartDoc || cartDoc.items.length === 0) {
        return handleNotFound(res, "Cart is empty or not found");
      }
  
      const customerAddress = await findById(
        CustomerAddress,
        customerAddressId,
        [],
        "Customer Address",
        res
      );
      if (!customerAddress) {
        return handleNotFound(res, "Customer address", customerAddressId);
      }
  
      const customer = await findById(Customer, customerId, [], "Customer", res);
      if (!customer) {
        return handleNotFound(res, "Customer", customerId);
      }
  
      const cartItems = cartDoc.items;
      let totalSale = 0;
      let totalProductsSold = 0;
  
      const orders = cartItems.map(async (item) => {
        const orderDoc = new Order();
        orderDoc.cart = cart;
        orderDoc.customer = customerId;
        orderDoc.customerAddress = customerAddressId;
        orderDoc.product = item.product._id;
        orderDoc.quantity = item.quantity;
        orderDoc.price = item.product.price * item.quantity;
        orderDoc.paymentId = paymentId;
        orderDoc.status = "PLACED";
  
        totalSale += orderDoc.price;
        totalProductsSold += item.quantity;
  
        await Product.findOneAndUpdate(
          {
            _id: item.product._id,
            "stocks.color": item.color,
            "stocks.size": item.size,
          },
          {
            $inc: {
              "stocks.$.unit": -item.quantity,
              totalProductsSold: item.quantity,
              totalSale: orderDoc.price,
            },
          },
          { new: true }
        );
  
        return orderDoc.save();
      });
  
      await Promise.all(orders);
  
      await Customer.findByIdAndUpdate(
        customerId,
        {
          $inc: {
            totalProductsBought: totalProductsSold,
            totalPurchase: totalSale,
          },
        },
        { new: true }
      );
  
      await Cart.findByIdAndDelete(cart);
  
      return res.status(200).json({
        success: true,
        message: "Checkout successful",
      });
    } catch (error) {
      console.error(error);
      return handleErrorResponse(res, error);
    }
  });


  export const getOrderById = asyncHandler(async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await Order.findById(orderId)
        .populate({
          path: "customer",
          populate: {
            path: "user",
          },
        })
        .populate("customerAddress")
        .populate("product")
        .exec();
  
      if (!order) {
        return handleNotFound(res, "Order not found");
      }
      return res.status(200).json({
        success: true,
        message: "Order retrieved successfully",
        order,
      });
    } catch (error) {
      console.error(error);
      return handleErrorResponse(res, error);
    }
  });

  export const getAllOrders = asyncHandler(async (req, res) => {
    try {
      const { page, pageSize } = req.query;
      const options = {
        page: parseInt(page, 10) || 1,
        pageSize: parseInt(pageSize, 10) || 10,
        sortField: req.query.sortField || "createdAt",
        sortOrder: req.query.sortOrder || "desc",
        populateFields: [
          "customerAddress",
          "product",
          {
            path: "customer",
            populate: {
              path: "user",
            },
          },
        ],
      };
      const { documents: orders, pagination } = await paginate(
        Order,
        {},
        options
      );
      return res.status(200).json({ success: true, orders, pagination });
    } catch (error) {
      console.error(error);
      return handleErrorResponse(res, error);
    }
  });
  
  export const getOrderByCustomerById = asyncHandler(async (req, res) => {
    try {
      const { page, pageSize } = req.query;
  
      const { customerId } = req.params;
      const customer = await findById(Customer, customerId, [], "Customer", res);
      if (!customer) {
        handleNotFound(res, "Customer", customerId);
      }
  
      const options = {
        page: parseInt(page, 10) || 1,
        pageSize: parseInt(pageSize, 10) || 10,
        sortField: req.query.sortField || "createdAt",
        sortOrder: req.query.sortOrder || "desc",
        populateFields: [
          "customerAddress",
          "product",
          {
            path: "customer",
            populate: {
              path: "user",
            },
          },
        ],
      };
      const { documents: orders, pagination } = await paginate(
        Order,
        { customer: customerId },
        options
      );
  
      return res.status(200).json({
        success: true,
        message: "Orders retrieved successfully",
        orders,
        pagination,
      });
    } catch (error) {
      console.error(error);
      return handleErrorResponse(res, error);
    }
  });