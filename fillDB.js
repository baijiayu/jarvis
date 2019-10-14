var  mongoose = require("mongoose"),
    Device = require("./models/device.js");

const fs = require('fs');
var parser = require('xml-js');

var dirPath = "../lirc-remotes"

function addDevice(brandName, deviceType, devicePath) {
	fs.readFile(devicePath, function(err, deviceData) {
    	var jsonStr = parser.xml2json(deviceData);
    	var json = JSON.parse(jsonStr);
    	buttonJson = json.elements[0].elements[0].elements
    	buttons = []
    	for(var i = 1; i < buttonJson.length; i++){
    		name = buttonJson[i].attributes.name
    		hex = buttonJson[i].attributes.codeno
    		buttons.push({
    			buttonName: name,
    			hex: hex
			});
    	}
    	var deviceObj = {
			brand: brandName, deviceType: deviceType, protocol: "NA", buttons: buttons
		}
    	Device.create(deviceObj,function(err,storedDevice){
        	if(err){
            	console.log(err);
        	}
        	console.log("created:" + brandName + ":" + deviceType)
    	});
 	});
}

function addBrand(brandName, brandPath) {
	fs.readdir(brandPath, function(err, deviceTypes) {
		deviceTypes = deviceTypes.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
    	for (var i=0; i<deviceTypes.length; i++) {
    		if(deviceTypes[i].startsWith("README")){
    			continue
    		}
    		if(deviceTypes[i].endsWith(".xml")){
    			var deviceInfoPath = brandPath + "/" + deviceTypes[i]
        		//strip off the ending .xml to get the device type
        		var deviceType = deviceTypes[i].substring(0,deviceTypes[i].length - 4)
        		addDevice(brandName, deviceTypes[i], deviceInfoPath)
    		}
    	}
	});
}

function fillDB(){
	fs.readdir(dirPath, function(err, brands) {
		brands = brands.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
    	for (var i=0; i<brands.length; i++) {
    		if(brands[i].startsWith("README") || brands[i] == "process.py"){
    			continue
    		}
        	var brandPath = dirPath + "/" + brands[i]
        	addBrand(brands[i], brandPath)
    	}
	});
	console.log("DONE")
}

module.exports = fillDB;