const express = require('express');
const router = express.Router();
const Cmnt = require("../models/Comment")
const Product = require("../models/Product")
const User = require("../models/User");

/* GET home page. */
router.post('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const { userId, rating, comment } = req.body;

    const find = await Cmnt.findOne({userId, product: productId})
      if (find) {
        res.status(500).json("Cannot save. Duplicate entry.")
      } else {
        const newComment = new Cmnt({
          userId,
          rating,
          comment,
          product: productId,
        });
    
        const savedComment = await newComment.save();
    
        const prod = await Product.findById(productId);
        if (!prod) {
          return res.status(404).json({ error: 'Product not found.' });
        }
        prod.comments.push(savedComment);
        await prod.save();
    
        const usercmnt = await User.findById(userId);
        if (!usercmnt) {
          return res.status(404).json({ error: 'User not found.' });
        }
        usercmnt.comments.push(savedComment);
        await usercmnt.save()

        prod.calculateAverageRating();
        await prod.save();
    
        res.status(200).json(savedComment);
      }
    
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/user/:id", async (req, res) => {
  const {comments} = await User.findById(req.params.id)
    .select("comments")
    .exec()

  try{
    res.status(200).json(comments)
  }catch(err) {
    res.status(500).json(err)
  }
})

router.get("/product/:id", async (req, res) => {
  const {comments} = await Product.findById(req.params.id)
    .select("comments")
    .exec()

  try{
    res.status(200).json(comments)
  }catch(err) {
    res.status(500).json(err)
  }
})


module.exports = router;