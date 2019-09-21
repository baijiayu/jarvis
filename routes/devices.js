var express = require("express");
var router = express.Router();
var UserDevice = require("../models/userDevice.js"),
    User = require("../models/user.js");

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
    UserDevice.findById(id).populate("deviceInfo").exec(function(error,userDevice){

        if(error){
          console.log(error)
          console.log("failed to find a specific device");
        }else{
          res.render("devices/controlPanel",{currentDevice : userDevice});
        }

    });
});

//SEND CODE
router.post("/:deviceId/:buttonName",isLoggedIn,function(req,res){
    var deviceId = req.params.deviceId;
    var buttonName = req.params.buttonName;

    UserDevice.findById(deviceId).populate("deviceInfo").exec(function(error,currentDevice){
        buttons = currentDevice.deviceInfo.buttons
        buttons.forEach(function(button){
          if(button.buttonName == buttonName){
            console.log("sending code");
            console.log(button);
            res.redirect("/devices/" + deviceId);
          }
        });
    });
});


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        console.log("not logged in!");
        res.redirect("/login");
    }
}

module.exports = router;