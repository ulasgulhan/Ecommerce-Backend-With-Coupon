const express = require('express');
const router = express.Router();
const Product = require("../models/Product")
const Category = require("../models/Category")
const axios = require("axios");

/* GET home page. */
router.post('/', async (req, res) => {
  const {
    title,
    desc,
    img,
    category,
    size,
    color,
    price
  } = req.body;

  try {
    const { name } = await Category.findOne({_id: category })
      .select("name")
      .exec()
    Product.find({category}).then(() => {
      const newProduct = new Product({
        title,
        desc,
        img,
        category: name,
        size,
        color,
        price
        })
        newProduct.save()
        res.status(200).json(newProduct)
    })}catch(err) {
      res.status(500).json(err)
    }
});

router.get("/", async (req, res) => {
  try{
    const products = await Product.find()
    if (!products) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.status(200).send(products)
  }catch(err){
    res.status(500).send(err)
  }
});

router.get("/:id", async (req, res) => {
  try{
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    const commentData = await axios.get('http://localhost:8000/comment');
    const comments = commentData.data;
    const productComments = comments.filter(comment => comment.product === req.params.id);

    let totalRating = 0;
    if (productComments.length > 0) {
      totalRating = productComments.reduce((sum, comment) => sum + comment.rating, 0);
      totalRating /= productComments.length;
    }

    res.status(200).send({ product, productComments, avarageRating: totalRating })
  }catch(err){
    res.status(500).send(err)
  }
});

module.exports = router;

