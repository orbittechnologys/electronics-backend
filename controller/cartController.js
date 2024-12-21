import asyncHandler from "express-async-handler";
import Cart from "../schemas/cartSchema.js";
import Customer from "../schemas/customerSchema.js";
import Product from "../schemas/productSchema.js";
import { handleErrorResponse, handleNotFound, handleAlreadyExists } from "../utils/responseHandler.js";
import { findById, paginate } from "../manager/finder.js";

export const addToCart = asyncHandler(async (req, res) => {   
    try {
        const { customerId, productId, quantity } = req.body;

        const customer = await findById(Customer, customerId);
        if (!customer) {
            return handleNotFound(res, "Customer not found",customerId);
        }

        const product = await findById(Product, productId);
        if (!product) {
            return handleNotFound(res, "Product not found",productId);
        }

        if(quantity > product.stock ){
            return res.status(400).json({
                msg:"Unfortunately, Product is out of stock",
                success:false
            })
        }

        let cart = await Cart.findOne({ customer: customer._id });
        if (!cart) {
            cart = new Cart({
                customer: customer._id,
                items: [],
                totalQty: 0,
                totalPrice: 0,
            });
        }

        const existingItem = cart.items.find(
            (item) => item.product.toString() === product._id.toString() 
        );

        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.price = existingItem.quantity * product.price;
        } else {
            cart.items.push({
                product: product._id,
                quantity,
                price: product.price * quantity,
            });
        }

        cart.totalQty += quantity;
        cart.totalPrice += product.price * quantity;

        cart.status = "INITIATED";

        await cart.save();

        return res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error(error);
        return handleErrorResponse(res, error);
    }
});


export const getCartById = asyncHandler(async (req, res) => {
    try {
        const { cartId } = req.params;

        const cart = await findById(Cart, cartId, ["customer", "items.product"]);

        if (!cart) {
            return handleNotFound(res, "Cart not found");
        }

        return res.status(200).json({ success: true, cart });

    } catch (error) {
        console.error(error);
        return handleErrorResponse(res, error);
    }
});

export const getAllCarts = asyncHandler(async (req, res) => {
    try {
        const { page, pageSize } = req.query;
        const options = {
            page: parseInt(page, 10) || 1,
            pageSize: parseInt(pageSize, 10) || 10,
            sortField: req.query.sortField || "createdAt",
            sortOrder: req.query.sortOrder || "asc",
            populateFields: ["customer", "items.product"],
        };
        const { documents: carts, pagination } = await paginate(Cart, {}, options);
        return res.status(200).json({ success: true, carts, pagination });

    } catch (error) {
        console.error(error);
        return handleErrorResponse(res, error);
    }
});

export const getCartByCustomerId = asyncHandler(async (req, res) => {
    try {
        const { customerId } = req.params;
        const cart = await Cart.findOne({ customer: customerId })
            .populate({
                path: "items",
                populate: {
                    path: "product",
                },
            })
        if (!cart) {
            return handleNotFound(res, "Cart not found");
        }

        return res.status(200).json({ success: true, cart });

    } catch (error) {
        console.error(error);
        return handleErrorResponse(res, error);
    }
});

export const updateCart = asyncHandler(async (req, res) => {
    try {
        const { customerId, productId, quantity } = req.body;

        if (!customerId || !productId || quantity === undefined) {
            return res.status(400).json({
                success: false,
                msg: "Customer ID, Product ID, and quantity are required."
            });
        }

        const customer = await findById(Customer, customerId);
        if (!customer) {
            return handleNotFound(res, "Customer not found", customerId);
        }

        const product = await findById(Product, productId);
        if (!product) {
            return handleNotFound(res, "Product not found", productId);
        }

        let cart = await Cart.findOne({ customer: customer._id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                msg: "Cart not found for the customer."
            });
        }

        const existingItem = cart.items.find(
            (item) => item.product.toString() === product._id.toString()
        );

        if (!existingItem) {
            return res.status(404).json({
                success: false,
                msg: "Product not found in the cart."
            });
        }

        if (quantity === 0) {
            // Remove item from cart
            cart.items = cart.items.filter(
                (item) => item.product.toString() !== product._id.toString()
            );
        } else {
            if (quantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    msg: "Requested quantity exceeds available stock."
                });
            }

            // Update item quantity and price
            existingItem.quantity = quantity;
            existingItem.price = quantity * product.price;
        }

        // Recalculate total quantity and price
        cart.totalQty = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price, 0);

        await cart.save();

        return res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error(error);
        return handleErrorResponse(res, error);
    }
});
