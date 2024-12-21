import mongoose from "mongoose";

const reqString = {
    type: String,
    required: true,
  };
  
  const categoriesSchema = mongoose.Schema({
    name: reqString,
    desc: String,
    roundBannerImage: String,
    bannerImage:String
  },
  { timestamps: true } 
  );
  
  categoriesSchema.pre("save", function (next) {
    this.dateModified = new Date();
    next();
  });

const Categories = mongoose.model("categories", categoriesSchema);

export default Categories;