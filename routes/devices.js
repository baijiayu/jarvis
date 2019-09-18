var express = require("express");
var router = express.Router();
var userDevice = require("../models/userDevice.js");
//*******************
//Device
//*******************
//Device List
router.get("/",isLoggedIn,function(req,res){
    Device.find({},function(error,devices){
        if(error){
            console.log("failed to retrieve devices");
            res.send("failed to retrieve devices");
        }else{
            res.render("devices/index",{devices : devices});
        }
    });
});

//SHOW
router.get("/:id",isLoggedIn,function(req,res){
    var id = req.params.id;
    Device.findById(id).populate("comments").exec(function(error,camp){
       if(error){
           console.log("failed to find a specific device");
       }else{
           res.render("devices/show",{campground : camp});
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