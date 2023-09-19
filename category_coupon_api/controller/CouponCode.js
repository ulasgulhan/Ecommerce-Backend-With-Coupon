const CouponCodeDiscount = require("../models/CouponCode");
const Product = require("../models/Product");
const User = require("../models/User");
const Coupon = require("../models/CouponGenerator")
const moment = require("moment");
const cc = require('voucher-code-generator');

exports.addUserCouponCodeDiscount = async(req, res) => {
    const {
        userId,
        productId,
        discount,
        discountStatus,
        expirationTime,
    } = req.body;
    if(userId){
    const { username } = await User.findOne({ _id: userId })
        .select("username")
        .exec();

    const name = username;

    if (discount && expirationTime) {
        try {

             const coupon = cc.generate({
                    length: 8,
                    count: 1
                }).toString()
        
            const newCoupon = new Coupon({"code": coupon[0]})
            
            const savedCoupon = await newCoupon.save()

            await Coupon.findOne({code:savedCoupon })
                .select("code")
                .exec();


            const endDate = new Date(expirationTime);
            let currentDate = new Date().getTime(); // new Date().getTime() returns value in number
            console.log(endDate, currentDate); // endDate number > currentDate number

            

            CouponCodeDiscount.find({ userId, savedCoupon}).then(
                (newCouponCodePrice, couponCodePriceUpdate) => {
                    if (!couponCodePriceUpdate) {
                        // it is newCouponCodeprice
                        if (
                            userId
                            
                        ) {
                            const couponCodeDiscount = new CouponCodeDiscount({
                                couponCodeName: coupon,
                                discountStatus,
                                userId: name,
                                discount,
                                expirationTime: endDate,
                            });

                            couponCodeDiscount
                                .save()
                                .then((couponDiscountProduct) => {
                                    console.log(couponDiscountProduct);
                                    return res.status(201).json({
                                        status: true,
                                        message: `Congrats,You have received Rs ${discount} as a product`,
                                        couponDiscountProduct,
                                    });
                                })

                            .catch((error) => {
                                console.log(error);
                                return res.status(400).json({
                                    status: false,
                                    message: "Something went wrong.You might have missed some field",
                                    error,
                                });
                            });
                        } else {
                            return res.status(403).json({
                                status: false,
                                message: "Unmatched Coupon Code. Discount Denied !!",
                            });
                        }
                    }

                    if (couponCodePriceUpdate) {
                        // it is update discount product of existing productID
                        const discountObj = {
                            couponCodeName: coupon,
                            discountStatus,
                            userId: name,
                            discount,
                            expirationTime: endDate,
                        };

                        // for update ,coupon code must be between 5 and 15

                        if (
                            discountObj.couponCodeName.length >= 5 &&
                            couponCodeName.length <= 15
                        ) {
                            // if coupon code expires,then it cannot be updated
                            CouponCodeDiscount.findOneAndUpdate({ productId: productId },
                                discountObj,

                                {
                                    new: true, // it returns the document after it is updated in database
                                    upsert: true, // if no such couponcode status type found in mongodb, then value is not updated in databse
                                }
                            ).exec((error, couponDiscountProduct) => {
                                if (error) {
                                    console.log(error);
                                    return res.status(400).json({
                                        status: false,
                                        message: "Opps...Coupon Code Discount cannot be updated",
                                    });
                                }
                                if (couponDiscountProduct) {
                                    return res.status(201).json({
                                        status: true,
                                        message: `Coupon Code Discount is updated...`,
                                        couponDiscountProduct,
                                    });
                                }
                            });
                        } else {
                            return res.status(400).json({
                                status: false,
                                message: "Coupon Code length must be between 5 and 15.",
                            });
                        }
                    }
                }
            );
            
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "Invalid Product id or Coupon Code or Username...",
            });
        }
    }}else if(productId){
        if (discount && expirationTime) {
            try {
                
                const { price } = await Product.findOne({ _id: productId })
                    .select("price")
                    .exec();
                
                const { title } = await Product.findOne({ _id: productId })
                    .select("title")
                    .exec();
                
                 const coupon = cc.generate({
                        length: 8,
                        count: 1
                    }).toString()
            
                const newCoupon = new Coupon({"code": coupon[0]})
                
                const savedCoupon = await newCoupon.save()
    
                await Coupon.findOne({code:savedCoupon })
                    .select("code")
                    .exec();
                 
    
                const originalPrice = price;
    
                const totalPrice = originalPrice - discount;
                const endDate = new Date(expirationTime);
                let currentDate = new Date().getTime(); // new Date().getTime() returns value in number
                console.log(endDate, currentDate); // endDate number > currentDate number
    
                
    
                CouponCodeDiscount.find({ productId, userId, savedCoupon}).then(
                    (newCouponCodePrice, couponCodePriceUpdate) => {
                        if (!couponCodePriceUpdate) {
                            // it is newCouponCodeprice
                            if (
                                
                                productId
                            ) {
                                const couponCodeDiscount = new CouponCodeDiscount({
                                    couponCodeName: coupon,
                                    discountStatus,
                                    productId: title,
                                    discount,
                                    originalPrice,
                                    finalPrice: totalPrice,
                                    expirationTime: endDate,
                                });
    
                                couponCodeDiscount
                                    .save()
                                    .then((couponDiscountProduct) => {
                                        console.log(couponDiscountProduct);
                                        return res.status(201).json({
                                            status: true,
                                            message: `Congrats,You have received Rs ${discount} as a product`,
                                            couponDiscountProduct,
                                        });
                                    })
    
                                .catch((error) => {
                                    console.log(error);
                                    return res.status(400).json({
                                        status: false,
                                        message: "Something went wrong.You might have missed some field",
                                        error,
                                    });
                                });
                            } else {
                                return res.status(403).json({
                                    status: false,
                                    message: "Unmatched Coupon Code. Discount Denied !!",
                                });
                            }
                        }
    
                        if (couponCodePriceUpdate) {
                            // it is update discount product of existing productID
                            const discountObj = {
                                couponCodeName: coupon,
                                discountStatus,
                                productId: title,
                                discount,
                                originalPrice,
                                finalPrice: totalPrice,
                                expirationTime: endDate,
                            };
    
                            // for update ,coupon code must be between 5 and 15
    
                            if (
                                discountObj.couponCodeName.length >= 5 &&
                                couponCodeName.length <= 15
                            ) {
                                // if coupon code expires,then it cannot be updated
                                CouponCodeDiscount.findOneAndUpdate({ productId: productId },
                                    discountObj,
    
                                    {
                                        new: true, // it returns the document after it is updated in database
                                        upsert: true, // if no such couponcode status type found in mongodb, then value is not updated in databse
                                    }
                                ).exec((error, couponDiscountProduct) => {
                                    if (error) {
                                        console.log(error);
                                        return res.status(400).json({
                                            status: false,
                                            message: "Opps...Coupon Code Discount cannot be updated",
                                        });
                                    }
                                    if (couponDiscountProduct) {
                                        return res.status(201).json({
                                            status: true,
                                            message: `Coupon Code Discount is updated...`,
                                            couponDiscountProduct,
                                        });
                                    }
                                });
                            } else {
                                return res.status(400).json({
                                    status: false,
                                    message: "Coupon Code length must be between 5 and 15.",
                                });
                            }
                        }
                    }
                );
                
            } catch (error) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid Product id or Coupon Code or Username...",
                });
            }
    }else {
        return res.status(400).json({
            status: false,
            message: "Something went Wrong, Discount or expiration time is invalid ",
        });
    }
}};