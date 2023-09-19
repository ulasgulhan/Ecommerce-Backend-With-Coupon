const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: {type: String, require: true, unique: true},
        email: {type : String, require: true, unique: true},
        password: {type: String, require: true, unique: true},
        isAdmin: {type: Boolean, default: false},
        comments: {type: Array, ref:"Comment"}
    },
    {timestamps: true}
)

module.exports = mongoose.model("User", UserSchema)