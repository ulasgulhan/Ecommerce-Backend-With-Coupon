const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
    title: {type: String, require: true, unique: true},
    desc: {type: String, require: true},
    img: {type: String, require: true},
    category: {type: String, require: true, ref:"Category"},
    size: {type: Array, require: true},
    color: {type: Array, require: true},
    price: {type: Number, require: true},
    inStock: {type: Boolean, default: true},
    comments: {type: Array, ref: "Comment"},
    averageRating: {type: Number}
    },
    {timestamps: true}
);

ProductSchema.methods.calculateAverageRating = function () {
    if (this.comments.length === 0) {
      this.averageRating = 0;
    } else {
      const totalRating = this.comments.reduce((acc, rating) => acc + rating.rating, 0);
      this.averageRating = totalRating / this.comments.length;
    }
  };
  

module.exports = mongoose.model("Product", ProductSchema) 