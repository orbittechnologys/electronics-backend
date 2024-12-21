import mongoose from "mongoose";

const reqString = {
    type: String,
    required: true,
};

const itemSchema = mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    quantity: { type: Number, default: 0, required:true },
    price: { type: Number, default: 0, required:true },
})

const cartSchema = mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'customers', required: true, unique: true},
    items: [itemSchema],
    totalQty: {
        type: Number,
        default: 0,
        required: true,
    },
    totalPrice: {
        type: Number,
        default: 0,
        required: true,
    },
    status: { type: String, default: "INITIATED", enum: ["INITIATED", "CHECKEDOUT"] }
},
    { timestamps: true }
);

cartSchema.pre("save", function (next) {
    this.dateModified = new Date();
    next();
});

const Cart = mongoose.model("carts", cartSchema);

export default Cart;