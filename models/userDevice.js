var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/jarvis");

//set up schema for campground
var UserDeviceSchema = new mongoose.Schema({
    deviceName : String,
    device : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Device"
        }
});

var UserDevice = mongoose.model("UserDevice",UserDeviceSchema);

module.exports = UserDevice;