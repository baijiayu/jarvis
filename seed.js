var  mongoose = require("mongoose"),
    User = require("./models/user.js"),
    Device = require("./models/device.js"),
    UserDevice = require("./models/userDevice.js"),
    Button = require("./models/button.js");

var testDellTVButtons = [{
		deviceBrand: "Dell",
		deviceType : "TV",
    	buttonName: "Power",
    	protocol: "MCE",
    	hex: "power code"
	},{
		deviceBrand: "Dell",
		deviceType : "TV",
    	buttonName: "Page Up",
    	protocol: "MCE",
    	hex: "page up code"
	},{
		deviceBrand: "Dell",
		deviceType : "TV",
    	buttonName: "Page Down",
    	protocol: "MCE",
    	hex: "page down code"
	},{
		deviceBrand: "Dell",
		deviceType : "TV",
    	buttonName: "Volume Up",
    	protocol: "MCE",
    	hex: "volume up code"
	},{
		deviceBrand: "Dell",
		deviceType : "TV",
    	buttonName: "Volume Down",
    	protocol: "MCE",
    	hex: "volume down code"
}]

var testDellTV = {
	brand: "Dell", deviceType: "TV", protocol: "MCE"
}

var testUserTV = {
	deviceName: "my Dell TV" 
}

var testUser = {
	username: "test_user",
	password: "123456"
}

function seedDB(){
	var storedTestUser, storedTestUserTV, storedTestDellTV;
	User.remove()
	UserDevice.remove()
	Device.remove()
	Button.remove()
	console.log("bootstrap test databse")

	User.create(testUser,function(err,storedUser){
        if(err){
            console.log(err);
        }else{
            storedTestUser = storedUser
        }
    });

    UserDevice.create(testUserTV,function(err,storedUserTV){
        if(err){
            console.log(err);
        }else{
        	storedTestUserTV = storedUserTV
            storedTestUser.deviceList.push(storedTestUserTV);
            storedTestUser.save();
        }
    });

    console.log(storedTestUserTV)

    Device.create(testDellTV,function(err,storedTV){
        if(err){
            console.log(err);
        }else{
        	storedTestDellTV = storedTV
            storedTestUserTV.deviceInfo = storedTestDellTV;
            storedTestUserTV.save();
        }
    });

	testDellTVButtons.forEach(function(dellButton){
		Button.create(dellButton,function(err, storedButton){
			if(err){
            	console.log(err);
        	}else{
            	storedTestDellTV.buttons.push(storedButton);
            	storedTestDellTV.save();
        	}
		});
	});
}

module.exports = seedDB;