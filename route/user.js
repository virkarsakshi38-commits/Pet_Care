var express = require("express");
var router = express.Router();
var exe = require("../connection");   

/* ================= HOME PAGE ================= */
router.get("/", async (req, res) => {
    var pets = await exe("SELECT * FROM pets");
    res.render("user/index.ejs", { pets });
});

// ABOUT
router.get("/about", function(req, res) {
    res.render("user/about.ejs");
});

// SERVICES
router.get("/services", function(req, res) {
    res.render("user/services.ejs");
});

// OUR TEAM
router.get("/our_team", function(req, res) {
    res.render("user/our_team.ejs");
});

// BLOG
router.get("/blog", function(req, res) {
    res.render("user/blog.ejs");

});

// CONTACT
router.get("/contact", function(req, res) {
    res.render("user/Contact.ejs");
});




// booking the page 


router.get("/book/:id", async (req, res) => {
    var id = req.params.id;

    var pet = await exe("SELECT * FROM pets WHERE id = ?", [id]);
    var pets = await exe("SELECT * FROM pets");

    res.render("user/book.ejs", {
        pet: pet[0],
        pets
    });
});

// save booking 

router.post("/save_booking", async (req, res) => {
    var { pet_id, pet_name, user_name, user_mobile } = req.body;

    await exe(
        "INSERT INTO booking (pet_id, pet_name, user_name, user_mobile) VALUES (?, ?, ?, ?)",
        [pet_id, pet_name, user_name, user_mobile]
    );

    res.redirect("/booking-success");
});


// success page 

router.get("/booking-success", (req, res) => {
    res.render("user/booking_success.ejs");
});

// enquiry page

router.post("/save_enquiry", async (req, res) => {
    var { name, email, subject, message } = req.body;

    await exe(
        "INSERT INTO enquiry (name, email, subject, message) VALUES (?, ?, ?, ?)",
        [name, email, subject, message]
    );

    res.redirect("/contact");
});



// save service booking 
router.post("/save_service", async function(req, res) {
    var service_name  = req.body.service_name;
    var customer_name = req.body.customer_name;
    var mobile        = req.body.mobile;

    await exe(
        "UPDATE services SET customer_name=?, mobile=? WHERE service_name=?",
        [customer_name, mobile, service_name]
    );

    res.redirect("/services");
});








router.post("/save-dog-info", async function (req, res) {

    var owner_name = req.body.owner_name;
    var mobile = req.body.mobile;
    var dog_name = req.body.dog_name;
    var breed = req.body.breed;
    var age = req.body.age;
    var gender = req.body.gender;
    var service = req.body.service;

    var sql = `
        INSERT INTO dog_info
        (owner_name, mobile, dog_name, breed, age, gender, service)
        VALUES (?,?,?,?,?,?,?)
    `;

    await exe(sql, [
        owner_name,
        mobile,
        dog_name,
        breed,
        age,
        gender,
        service
    ]);

    res.redirect("/thank-you");
});


/* THANK YOU PAGE */
router.get("/thank-you", function (req, res) {
    res.send(`
        <div style="text-align:center; margin-top:50px;">
            <h2>Thank You 🐶</h2>
            <p>Your dog information has been submitted successfully.</p>
            <a href="/" style="text-decoration:none;">Go Back</a>
        </div>
    `);
});

 module.exports = router;









