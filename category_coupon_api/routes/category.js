const express = require('express');
const router = express.Router();
const Category = require("../models/Category")
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../middlewear/verifyToken")


const buildAncestors = async (id, parent_id) => {
  let ancest = [];
  try {
      let parent_category = await Category.findOne({ "_id":    parent_id },{ "name": 1, "slug": 1, "ancestors": 1 }).exec();
if( parent_category ) {
         const { _id, name, slug } = parent_category;
         const ancest = [...parent_category.ancestors];
         ancest.unshift({ _id, name, slug })
         await Category.findByIdAndUpdate(id, { $set: { "ancestors": ancest } });
       }
    } catch (err) {
        console.log(err.message)
     }
}

/* GET home page. */
router.post('/', verifyTokenAndAdmin, async (req, res) => {
  let parent = req.body.parent ? req.body.parent : null;
  const category = new Category({name: req.body.name, parent})
try {
  let newCategory = await category.save();
  buildAncestors(newCategory._id, parent)
  res.status(201).send({ response: `Category ${newCategory._id}` });
} catch (err) {
  res.status(500).send(err);
}
});

router.get("/", async (req, res) => {
  try{
    const categorys = await Category.find()
    if (!categorys) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    res.status(200).send(categorys)
  }catch(err){
    res.status(500).send(err)
  }
})

router.get("/:id", async (req, res) => {
  try{
    const cat = await Category.findById(req.params.id)
    if (!categorys) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    res.status(200).send(cat)
  }catch(err){
    res.status(500).send(err)
  }
})

module.exports = router;
