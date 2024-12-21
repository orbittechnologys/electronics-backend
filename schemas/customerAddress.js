import mongoose from "mongoose";

const reqString = {
  type: String,
  required: true,
};

const customerAddressSchema = mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customers",
    required: true,
  },
  addressLine1: reqString,
  addressLine2: reqString,
  landmark: reqString,
  city: reqString,
  state: reqString,
  pincode: { type: Number, required: true },
  dateCreated: { type: Date, default: Date.now },
  dateModified: { type: Date, default: Date.now },
});

customerAddressSchema.pre("save", function (next) {
  this.dateModified = new Date();
  next();
});

const CustomerAddress = mongoose.model(
  "customerAddresses",
  customerAddressSchema
);

export default CustomerAddress;
