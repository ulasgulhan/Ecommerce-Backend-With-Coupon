const express = require('express');
const router = express.Router();
const User = require("../models/User")
const axios = require("axios");


/* GET home page. */
router.get('/', async (req, res, next) => {
  try{
    const user = await User.find()
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(200).send(user)
  }catch(err){
    res.status(500).send(err)
  }
});

router.get("/:id", async (req, res) => {
  try{
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const commentData = await axios.get('http://localhost:8000/comment');
    const comments = commentData.data;
    const userComments = comments.filter(comment => comment.userId === req.params.id);

    res.status(200).send({user, userComments})
  }catch(err){
    res.status(500).json(err)
  }
})

module.exports = router;
