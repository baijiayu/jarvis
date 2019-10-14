var express = require("express"),
    app = express(),
    bodyparser = require("body-parser"),
    mongoose = require("mongoose"),
    Device = require("./models/device"),
    User = require("./models/user"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    seedDB = require("./seed");
    fillDB = require("./fillDB");

var indexRoute = require("./routes/index.js"),
    deviceRoute = require("./routes/devices.js");

var port = 3000
var websocketPort = 8080


////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
// websocket connection to RPi
/*
https://stackoverflow.com/questions/16280747/sending-message-to-a-specific-connected-users-using-websocket
*/

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: websocketPort });

clientConnections = {}

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    message = JSON.parse(message);
    console.log("received handshake message from IR Man:")
    console.log(message)
    clientConnections[message.id] = ws;
  });
});

/*
opcode: 0 for sending ir command
opcode: 1 for starting locating devices
*/
module.exports.sendControlSignal = function (id, opcode, content){
    if(!id in clientConnections){
        console.log("IR Man not connected");
        return
    }

    if(!( id in clientConnections)){
        console.log("RPi not connected")
        return
    }

    ws = clientConnections[id];
    command = {opcode: opcode, content: content}
    ws.send(JSON.stringify(command));
};
//module.exports = {sendControlSignal:sendControlSignal}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

//use bodyparser
app.use(bodyparser.urlencoded({extended : true}));

//use stylesheets
app.use(express.static(__dirname + "/public"));

//connect to mongoose
mongoose.connect("mongodb://localhost/jarvis");

//seed test data in database 
//fillDB();

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
    console.log("server has started")
});
*/
app.listen(port, ()=> console.log("webapp listening on port: " + port + "!"))

