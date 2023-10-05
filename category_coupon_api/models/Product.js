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
    averageRating: {type: Number}
    },
    {timestamps: true}
);

module.exports = mongoose.model("Product", ProductSchema) 