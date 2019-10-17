const fs = require('fs');
var parser = require('xml-js');

let firstDropDown = fs.createWriteStream('firstDropDown.js');
let secondDropDown = fs.createWriteStream('secondDropDown.js');

var dirPath = "../lirc-remotes"

function newBrand(brandName, brandPath) {
	fs.readdir(brandPath, function(err, deviceTypes) {
        var code = "case \"" + brandName +"\" : \n"
        var index = 0
		deviceTypes = deviceTypes.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
    	for (var i=0; i<deviceTypes.length; i++) {
    		if(deviceTypes[i].startsWith("README")){
    			continue
    		}
    		if(deviceTypes[i].endsWith(".xml")){
    			var deviceInfoPath = brandPath + "/" + deviceTypes[i]
        		//strip off the ending .xml to get the device type
        		var deviceType = deviceTypes[i].substring(0,deviceTypes[i].length - 4)
                code = code + "\tdocument.getElementById(\"status\")\.options["+ index +"]=new Option(\"" + deviceType + "\",\"" + deviceType + "\")\;" + "\n";
                index += 1
/*
        case "manual" :
        document.getElementById("status").options[i]=new Option("Select status","");
*/
    		}
    	}
        code += "\tbreak;\n"
        secondDropDown.write(code);
	});
}

function getDropDownCode(){
	fs.readdir(dirPath, function(err, brands) {
		brands = brands.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
    	for (var i=0; i<brands.length; i++) {
    		if(brands[i].startsWith("README") || brands[i] == "process.py"){
    			continue
    		}
        	var brandPath = dirPath + "/" + brands[i]
            var brandName = brands[i]
            var brandStr = "\<option value=\"" + brandName + "\"\>" + brandName + "\<\/option\>"
            firstDropDown.write(brandStr + "\n");
        	newBrand(brandName, brandPath)
    	}
	});
	console.log("DONE")
}

// the finish event is emitted when all data has been flushed from the stream
firstDropDown.on('finish', () => {
    console.log('wrote all data to file');
});

getDropDownCode()
