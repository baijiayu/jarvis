var express = require("express");
var router = express.Router();
var UserDevice = require("../models/userDevice.js"),
    User = require("../models/user.js"),
    Button = require("../models/button.js");

//*******************
//Device
//*******************
//Device List
router.get("/",isLoggedIn,function(req,res){
    //save username and userId
    var username = req.user.username;
    var userId = req.user._id;

    User.findById(userId).populate("deviceList").exec(function(err,user){
      if(err){
        console.log(err)
      }
      else{
        res.render("devices/index",{ currentUser : user});
      }
    });
});

//SHOW
router.get("/:id",isLoggedIn,function(req,res){
    var id = req.params.id;
    UserDevice.findById(id).populate({
      path : 'Device',
      populate : {
        path : 'Button'
      }}).exec(function(error,userDevice){

        if(error){
          console.log("failed to find a specific device");
        }else{
          res.render("devices/controlPanel",{currentDevice : userDevice});
        }

    });
});

//SEND CODE
router.post("/send/:id",isLoggedIn,function(req,res){
    var id = req.params.id;
    Button.findById(id, function(err, button){
      if(err){
        console.log(err)
      }else{
        console.log("send code")
        console.log(button)
      }
    });
});


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}

module.exports = router;