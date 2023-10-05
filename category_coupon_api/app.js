const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const indexRouter = require('./routes/index');
const categoryRouter = require("./routes/category");
const productRouter = require("./routes/product");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const couponCodeDiscount  = require("./routes/couponcodes");
const UserCouponCodeDiscount  = require("./models/CouponCode");
const bodyParser = require('body-parser');



const app = express();

app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("DB Connection Successfull!"))
.catch((err) => {
  console.log(err);
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/category', categoryRouter);
app.use('/product', productRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/coupon', couponCodeDiscount);


//Expire Coupon
const userCheckExpirationTime = async () => {
    UserCouponCodeDiscount.find({})
        .exec()
        .then((Coupon) => {
            if (Coupon) {
                Coupon.map((getCoupon) => {
                    if (
                        new Date().getTime() >= new Date(getCoupon.expirationTime).getTime() // expirationTime data access from database
                    ) {
                    
                      UserCouponCodeDiscount.findOneAndUpdate(
                                {_id: getCoupon._id},
                                {$set: {discountStatus: "false"}}
                            )
                            .exec()
                            .then(() => {
                                console.log(`Coupon doesnt exists or expired`);
  
                            })
                            .catch((error) => {
                                console.log(error, "Error occured on coupon section");
                            });
                    }
                });
            }
            if (!Coupon) {
                console.log("No Coupon found...");
            }
        });
  };
  setInterval(userCheckExpirationTime, 1000); 


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, () => {
  console.log("Backend Server is Running")
})

module.exports = app;
