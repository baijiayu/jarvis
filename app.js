var express = require("express"),
    app = express(),
    bodyparser = require("body-parser");

var indexRoute = require("./routes/index.js");

var port = 3000

//use bodyparser
app.use(bodyparser.urlencoded({extended : true}));

//use stylesheets
app.use(express.static(__dirname + "/public"));

//use ejs as template
app.set("view engine", "ejs");


app.use("/",indexRoute);

/*
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("camp has started")
});
*/
app.listen(port, ()=> console.log("listening on port: " + port + "!"))