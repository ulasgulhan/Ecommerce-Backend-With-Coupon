const express = require('express');
const router = express.Router();
const Product = require("../models/Product")
const Category = require("../models/Category")

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
    res.status(200).send(products)
  }catch(err){
    res.status(500).send(err)
  }
});

router.get("/:id", async (req, res) => {
  try{
    const product = await Product.findById(req.params.id)
    res.status(200).send(product)
  }catch(err){
    res.status(500).send(err)
  }
});

module.exports = router;

