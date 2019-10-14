var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user.js")
// =========
// Landing Routes
// =========
router.get("/",function(req,res){
    res.render("landing");
});
module.exports = router;


// =========
// User Authentification Routes
// =========
router.get("/register",function(req,res){
    res.render("register");
});

router.post("/register",function(req,res){
    User.register(new User({username: req.body.username, IRManID: req.body.IRManID}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
            console.log("register successful")
           res.redirect("/devices");
        });
    });
});

router.get("/login",function(req,res){
    res.render("login");
});

router.post("/login",passport.authenticate("local",
    {
        successRedirect:"/devices",
        failureRedirect:"/login"
    }),function(req,res){
});

router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}
