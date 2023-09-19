const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
    {
        product:{
            type: String,
            ref: "Product"
        },
        userId:{
            type: String,
            require: true,
            ref:"User"
        },
        rating: {
            type: Number,
            require: true,
            min:1,
            max:5
        },
        comment:{
            type: String
        },
    },
    {timestamps: true}
)

CommentSchema.index({ userId: 1, product: 1 }, { unique: true });

module.exports = mongoose.model("Comment", CommentSchema)