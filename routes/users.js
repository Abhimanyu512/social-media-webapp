var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var Post = require('../models/post');
var Comment = require('../models/comment');
var router = express.Router();

/* GET users listing. */
router.get("/", function(req, res){
  res.redirect('/login');
});

router.get("/user/:id", function(req, res){
  User.findById(req.params.id, function(err, foundUser){
    if(err)
      console.log(err);
    else{
      Post.find({author: {id: req.user._id,dp: req.user.dp, username: req.user.username}}, function(err, foundPost){
        if(err)
          console.log(err);
        res.render("profile", {user: foundUser, posts: foundPost});
      })
    }
  })
})

//Search Routes
router.get('/search', function(req, res){
  res.render('search');
})

router.post('/searchresults', function(req, res){
  User.find({name: req.body.username}, function(err, foundUser){
    if(err)
      console.log(err);
    else
      res.render('searchresults', {users: foundUser});
  })
})

//Register Routes
router.get("/register", function(req, res){
  res.render("register");
});

router.post("/register", function(req, res){
 var newUser = new User({name: req.body.name,dp: req.body.dp,bio: req.body.bio,username: req.body.username});
 User.register(newUser, req.body.password, function(err, user){
     if(err){
        //  req.flash("error", err.message);
        console.log(err);
         return res.render("register");
     } else {
        passport.authenticate("local")(req, res, function(){
          // req.flash("success", "Welcome " + user.username);
          res.redirect("/index");
        });
     }
 });
});

//Login Routes
router.get("/login", function(req, res){
 res.render("login");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/index",
  failureRedirect: "/login" 
 }),function(req, res){
     console.log("Authentication was successful");
 });

//Logout Routes
router.get("/logout", function(req, res){
  req.logout();
  // req.flash("success", "Logged You Out");
  res.redirect("/login");
})

module.exports = router;
