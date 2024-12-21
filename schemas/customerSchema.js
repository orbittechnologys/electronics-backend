import mongoose from "mongoose";

const reqString = {
  type: String,
  required: true,
};

const customerSchema = mongoose.Schema({
  firstName: reqString,
  lastName: reqString,
  totalProductsBought: { type: Number, default: 0 },
  totalPurchase: { type: Number, default: 0 },
  gender: {
    type: String,
    enum: ["MALE", "FEMALE"],
    required: true,
    default: "MALE",
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  dateCreated: { type: Date, default: Date.now },
  dateModified: { type: Date, default: Date.now },
});

customerSchema.pre("save", function (next) {
  this.dateModified = new Date();
  next();
});

const Customer = mongoose.model("customers", customerSchema);

export default Customer;