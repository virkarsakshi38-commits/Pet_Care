var mysql = require("mysql2");
var util = require("util");


const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pet_care_website",
})
const exe = util.promisify(conn.query).bind(conn);


module.exports = exe;