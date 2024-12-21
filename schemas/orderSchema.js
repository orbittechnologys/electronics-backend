import mongoose from "mongoose";

const reqString = {
  type: String,
  required: true,
};

const orderSchema = mongoose.Schema(
    {
      cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts",
      },
      customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customers",
        required: true,
      },
      customerAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customerAddresses",
        required: true,
      },
      product : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      quantity: {
        type: Number,
        required:true,
      },
      price: {
        type: Number,
        required:true
      },
      paymentId: { type: String },
      status: {
        type: String,
        enum: ["PLACED", "DISPATCHED", "DELIVERED", "CANCELLED"],
        default:"PLACED",
        required:true
      },
      orderDate: { type: Date, default: Date.now },
      deliveryDate: { type: Date },
    },
    { timestamps: true }
  );
  
  orderSchema.pre("save", function (next) {
    this.dateModified = new Date();
    next();
  });
  
  const Order = mongoose.model("orders", orderSchema);
  
  export default Order;