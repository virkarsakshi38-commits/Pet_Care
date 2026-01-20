var express = require("express");
var bodyparser = require("body-parser");
var upload = require("express-fileupload");
var user_route = require("./route/user");
var admin_route = require("./route/admin");
var admin_login = require("./route/admin_login");
var url = require("url");
var session = require("express-session");

var app = express();
app.set("view engine", "ejs");


app.use(bodyparser.urlencoded({ extended: true }));
app.use(upload());
app.use(express.static("public/"));

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "a2zithub"
}));

app.use("/", user_route);
app.use("/admin", admin_route);
app.use("/admin_login", admin_login); 

app.listen(1000, () => {
    console.log("Server running on port 1000");
});
