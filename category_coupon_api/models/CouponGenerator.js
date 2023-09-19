const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CouponSchema = new Schema({

    code: {
        type: String, 
        require: true, 
        unique: true,
        min: 5,
        max: 15,
        trim: true,
    },
    isActive: {type: Boolean, default: true}

})

module.exports = mongoose.model("coupon", CouponSchema)