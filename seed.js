var  mongoose = require("mongoose"),
    User = require("./models/user.js"),
    Device = require("./models/device.js"),
    UserDevice = require("./models/userDevice.js"),
    Button = require("./models/button.js");

var testDellTVButtons = [{
    	buttonName: "Power",
    	hex: "power code"
	},{
    	buttonName: "Page Up",
    	hex: "page up code"
	},{
    	buttonName: "Page Down",
    	hex: "page down code"
	},{
    	buttonName: "Volume Up",
    	hex: "volume up code"
	},{
    	buttonName: "Volume Down",
    	hex: "volume down code"
}]

var testDellTV = {
	brand: "Dell", deviceType: "TV", protocol: "MCE", buttons: testDellTVButtons
}

var testUserTV = {
	deviceName: "my Dell TV" 
}

var testUser = {
	username: "test_user",
	password: "123456",
    IRManID: "59e6ace6750d71996bc915369adb2577"
}

function seedDB(){
	/*
	User.remove({},function(err){
    	if(err){
        	console.log(err);
    	}else{
    		console.log("removed all User")
    	}
	});
	UserDevice.remove({},function(err){
    	if(err){
        	console.log(err);
    	}else{
    		console.log("removed all UserDevice")
    	}
	});
	Device.remove({},function(err){
    	if(err){
        	console.log(err);
    	}else{
    		console.log("removed all Device")
    	}
	});
    */
	User.findOne({username: "maxbai"}).populate({
        path : 'DeviceList'
      }).exec(function(err,storedUser){
        if(err){
            console.log(err);
        }else{
           	UserDevice.create(testUserTV,function(err,storedUserTV){
		    	if(err){
            		console.log(err);
        		}else{
            		storedUser.deviceList.push(storedUserTV);
            		storedUser.save();
            		Device.create(testDellTV,function(err,storedTV){
        				if(err){
            				console.log(err);
        				}else{
							storedUserTV.deviceInfo = storedTV;
            				storedUserTV.save();
        				}
    				});
            	}
            });
        }
    });
    
}

module.exports = seedDB;