var express = require("express");
var router = express.Router();
var UserDevice = require("../models/userDevice.js"),
    User = require("../models/user.js"),
    Device = require("../models/device.js");
var sender = require("../app.js");

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

//NEW user device
router.get("/new", isLoggedIn, function(req,res){
    res.render("devices/new");
});

//CREATE new user device
router.post("/",isLoggedIn,function(req,res){
    var userId = req.user._id;
    var brand = req.body.source;
    var deviceType = req.body.status;
    var deviceName = req.body.deviceName;
    var type = req.body.type;

    User.findById(userId).populate("deviceList").exec(function(err,user){
      if(err){
        console.log(err)
      }
      else{
        Device.find({brand : brand, deviceType : deviceType}, function(err, devices){
          if(devices.length == 0){
            console.log("device not found")
            res.redirect("/devices");
          }
          device = devices[0]
          if(err){
            console.log(err)
          }else{
            var userDevice = {
                deviceName: deviceName,
                type: type
            }
            UserDevice.create(userDevice,function(err,storedUserDevice){
              if(err){
                console.log(err);
              }else{
                storedUserDevice.deviceInfo = device;
                storedUserDevice.save()
                user.deviceList.push(storedUserDevice);
                user.save();
              }
            });
          }
        });
      }
    });
    res.redirect("/devices");
});

//SEND calibrate command
router.get("/calibrate", isLoggedIn, function(req,res){
  var userId = req.user._id;

  User.findById(userId).populate({
        path:"deviceList",
        model:"UserDevice",
        populate:{
          path:"deviceInfo",
          model:"Device"
        }
      }).exec(function(err,user){
      if(err){
        console.log(err)
      }
      else{
        command = []
        user.deviceList.forEach(function(userDevice){
          type = userDevice.type
          console.log(userDevice.deviceInfo)
          deviceType = userDevice.deviceInfo.deviceType
          brand = userDevice.deviceInfo.brand
          command.push({brand: brand, deviceType: deviceType, type: type});
        });
        var id = req.user.IRManID;
        console.log(command)
        sender.sendControlSignal(id,1,command)
      }
    });
    res.redirect("/devices");
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
            //find the id for this user's irman
            id =  req.user.IRManID;
            //construct the request
            opcode = 0
            command = {deviceBrand: currentDevice.deviceInfo.brand, 
                      deviceType: currentDevice.deviceInfo.deviceType,
                      button: buttonName}
            sender.sendControlSignal(id,opcode,command)
            res.redirect("/devices/" + deviceId);
          }
        });
    });
});


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        console.log("user not logged in!");
        res.redirect("/login");
    }
}

module.exports = router;