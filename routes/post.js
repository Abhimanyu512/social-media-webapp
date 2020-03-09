var express = require('express');
var Post = require('../models/post');
var Comment = require('../models/comment');
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res){
  Post.find({}).populate('comments').exec(function(err, allPosts){
    if(err)
      console.log(err);
    else
      res.render("home", {posts: allPosts});
  })
})

//New Route
router.get("/new", function(req, res){
  res.render("new");
})

//Create Route
router.post("/", function(req, res){
  var image = req.body.image;
  var author = {
    id: req.user._id,
    dp: req.user.dp,
    username: req.user.username,
  };
  var newPost = {
    image: image,
    author: author
  };
  Post.create(newPost, function(err,newPost){
    if(err)
      console.log(err);
    else{
      res.redirect("/index");
    }
  })
})

//Create Comment Route
router.post('/:id', function(req,res){
  Post.findById(req.params.id, function(err,foundPost){
    if(err){
      console.log(err);
    }
    else{
      Comment.create(req.body.comment, function(err,newComment){
        if(err)
          console.log(err);
        else{
          newComment.author.id = req.user._id;
          newComment.author.username = req.user.username;
          newComment.save();
          foundPost.comments.push(newComment);
          foundPost.save();
          res.redirect('/index');
        }
      })
    }
  })
})

module.exports = router;
