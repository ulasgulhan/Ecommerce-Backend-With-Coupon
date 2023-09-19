const express = require('express');
const router = express.Router();
const User = require("../models/User")

/* GET home page. */
router.get('/', async (req, res, next) => {
  try{
    const user = await User.find()
    res.status(200).send(user)
  }catch(err){
    res.status(500).send(err)
  }
});

router.get("/:id", async (req, res) => {
  try{
    const user = await User.findById(req.params.id)
    res.status(200).send(user)
  }catch(err){
    res.status(500).send(err)
  }
})

module.exports = router;
