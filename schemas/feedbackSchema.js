import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    feedback: {
      type: String,
    },
    reviewImages: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

feedbackSchema.pre("save", function (next) {
  this.dateModified = new Date();
  next();
});

const Feedback = mongoose.model("feedbacks", feedbackSchema);

export default Feedback;
