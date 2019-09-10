var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/jarvis");

//set up schema for campground
var deviceSchema = new mongoose.Schema({
    buttons : [String],
    buttonMap: String,
    description : Map
});

var Device = mongoose.model("Device",deviceSchema);

module.exports = Device;