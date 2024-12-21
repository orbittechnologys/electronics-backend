import mongoose from "mongoose";

const reqString = {
    type: String,
    required: true,
  };
  
  const subCategoriesSchema = mongoose.Schema({
    name: reqString,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "categories", required: true },
    desc: String,
  },
  { timestamps: true } 
  );
  
  subCategoriesSchema.pre("save", function (next) {
    this.dateModified = new Date();
    next();
  });

const SubCategories = mongoose.model("subcategories", subCategoriesSchema);

export default SubCategories;