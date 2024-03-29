var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/jarvis");
var passportMongoose = require("passport-local-mongoose");

//set up schema for user
var UserSchema = new mongoose.Schema({
    username : String,
    password : String,
    deviceList : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "UserDevice"
        }
    ],
    IRManID : String
});
UserSchema.plugin(passportMongoose);
var User = mongoose.model("User",UserSchema);

module.exports = User;