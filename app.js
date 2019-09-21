var express = require("express"),
    app = express(),
    bodyparser = require("body-parser"),
    mongoose = require("mongoose"),
    Device = require("./models/device"),
    User = require("./models/user"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    seedDB = require("./seed");

var indexRoute = require("./routes/index.js"),
    deviceRoute = require("./routes/devices.js");

var port = 3000

//use bodyparser
app.use(bodyparser.urlencoded({extended : true}));

//use stylesheets
app.use(express.static(__dirname + "/public"));

//connect to mongoose
mongoose.connect("mongodb://localhost/jarvis");

//seed test data in database 
//seedDB();

//use ejs as template
app.set("view engine", "ejs");


//user auth.
app.use(require("express-session")({
    secret : "secret",
    resave : false,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//pass in currentUser to all pages
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

//index and user auth.
app.use("/",indexRoute);

//device routes
app.use("/devices",deviceRoute);

/*
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("camp has started")
});
*/
app.listen(port, ()=> console.log("listening on port: " + port + "!"))

