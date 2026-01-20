var mysql = require("mysql2");
var util = require("util");


const conn = mysql.createConnection({
    host: "bmaa2u5mxjfx53u6cjax-mysql.services.clever-cloud.com",
    user: "ujvinsxeubrjvp2w",
    password: "tBQEUWQOJZ8zsyNdF0oR",
    database: "bmaa2u5mxjfx53u6cjax",
})
const exe = util.promisify(conn.query).bind(conn);


module.exports = exe;
