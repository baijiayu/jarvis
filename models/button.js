var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/jarvis");

//set up schema for button
var ButtonSchema = new mongoose.Schema({
    deviceBrand : String,
    deviceType : String,
    buttonName: String,
    protocol: String,
    hex: String
});

var Button = mongoose.model("Button",ButtonSchema);

module.exports = Button;