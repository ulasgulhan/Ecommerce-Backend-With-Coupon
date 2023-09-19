const express = require("express");
const router = express.Router();
const {addUserCouponCodeDiscount} = require("../controller/CouponCode");


router.post("/user", addUserCouponCodeDiscount);

module.exports = router;