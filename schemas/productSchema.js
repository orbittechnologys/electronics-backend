import mongoose from "mongoose";

const reqString = {
  type: String,
  required: true,
};

const reqNumber = {
  type: Number,
  required: true,
};

const productSchema = mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subcategories",
      required: true,
    },
    name: reqString,
    desc: reqString,
    bannerImage: reqString,
    rating: { type: Number, required: true, default: 3 },
    noOfRatings: { type: Number, required: true, default: 0 },
    color: reqString,
    prodImages: [String],
    stock: { type: Number, required: true, default: 1 },
    price: reqNumber,
    inflatePrice: reqNumber,
    totalProductsSold: { type: Number, required: true, default: 0 },
    totalSale: { type: Number, required: true, default: 0 },
    status: { type: String, required: true, enum: ["ACTIVE", "INACTIVE"] },
    featureList: [String],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("products", productSchema);

export default Product;
