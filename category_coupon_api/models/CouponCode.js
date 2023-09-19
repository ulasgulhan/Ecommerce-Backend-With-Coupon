const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

// creating objectSchema

const couponCodeSchema = new Schema({
    couponCodeName: {
        type: String,
        trim: true,
        required: true,
        ref:"coupon"
    },
    userId: {
        type: String,
        ref: "User",
        
    },
    productId: {
        type: String,
        ref: "Product",
        
    },
    discount: {
        type: String,
    },
    discountStatus: {
        type: Boolean,
        required: true,
    },

    originalPrice: {
        type: Number,
    },
    finalPrice: {
        type: Number,
    },
    createdAt: {
        type: String,
        default: moment().format("DD/MM/YYYY") + ";" + moment().format("hh:mm:ss"),
    },
    updatedAt: {
        type: String,
        default: moment().format("DD/MM/YYYY") + ";" + moment().format("hh:mm:ss"),
    },
    expirationTime: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("user-couponcode-discount-product", couponCodeSchema)