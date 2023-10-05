const express = require('express');
const router = express.Router();
const Cmnt = require("../models/Comment")
const Product = require("../models/Product")
const User = require("../models/User");
const axios = require("axios");
const mongoose = require('mongoose');

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
    
        const prod = await axios.get(`http://localhost:3000/product/${productId}`);
        if (!prod) {
          return res.status(404).json({ error: 'Product not found.' });
        }    

        const usercmnt = await axios.get(`http://localhost:3000/user/${userId}`);
        if (!usercmnt) {
          return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json(savedComment);
      
      }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try{
    const comments = await Cmnt.find()
    if (!comments) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.status(200).send(comments)
  }catch(err){
    res.status(500).json(err)
  }
})


module.exports = router;