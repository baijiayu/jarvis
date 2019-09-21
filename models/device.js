var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/jarvis");

//set up schema for device
var deviceSchema = new mongoose.Schema({
    brand : String,
    deviceType: String,
    protocol : String,
    buttons : [
        {
            buttonName : String,
            hex : String
        }
    ]

});

var Device = mongoose.model("Device",deviceSchema);

module.exports = Device;