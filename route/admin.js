const express = require("express");
const router = express.Router();
const exe = require("../connection"); 





router.get("/services", async function (req, res) {
    var sql = "SELECT * FROM services";
    var services = await exe(sql);
    res.render("admin/services.ejs", { services });
});


router.post("/save-service", async function (req, res) {
    var service_name = req.body.service_name;
    var price = req.body.price;

    await exe(
        "INSERT INTO services (service_name, price) VALUES (?, ?)",
        [service_name, price]
    );

    res.redirect("/admin/services");
});







          // --------------------------------------- BLOGS-------------------------------------------

router.get("/blogs", async function(req, res){
    var sql = "SELECT * FROM blogs";
    var blogs = await exe(sql);
    res.render("admin/blogs.ejs", { blogs });
});



router.post("/save-blog", async function(req, res)
{
    var title = req.body.title;
    var slug = req.body.slug;
    var description = req.body.description;
    var image = req.body.image;

    var sql = `
        INSERT INTO blogs (title, slug, description, image)
        VALUES (?, ?, ?, ?)
    `;

    await exe(sql, [title, slug, description, image]);

    res.redirect("/admin/blogs");
});



//--------------------------- team-----------------------------------------


router.get("/team", async function (req, res) {
    var sql = "SELECT * FROM team";
    var team = await exe(sql);
    res.render("admin/team.ejs", { team });
});

router.post("/save_team", async function (req, res) {
    var name = req.body.name;
    var designation = req.body.designation;
    var image = req.body.image;

    var sql = `
        INSERT INTO team (name, designation, image)
        VALUES (?, ?, ?)
    `;

    await exe(sql, [name, designation, image]);

    res.redirect("/admin/team");
});



// --------------------pets----------------------------/


router.get("/pets", async function (req, res) {
    var sql = "SELECT * FROM pets";
    var pets = await exe(sql);

    res.render("admin/pets.ejs", { pets });
});


router.post("/save_pets", async function (req, res) {
    var dog_name = req.body.dog_name;
    var dog_food = req.body.dog_food;
    var dog_image = req.body.dog_image;
    var dog_care_description = req.body.dog_care_description;

    var sql = `
        INSERT INTO pets 
        (dog_name, dog_food, dog_image, dog_care_description)
        VALUES (?, ?, ?, ?)
    `;

    await exe(sql, [
        dog_name,
        dog_food,
        dog_image,
        dog_care_description
    ]);

    res.redirect("/admin/pets");
});



//-------------------------------------- booking -----------------------------





router.get("/booking", async function(req, res) {

    var sql = `
        SELECT 
            booking.*, 
            pets.dog_image 
        FROM booking 
        LEFT JOIN pets ON booking.pet_id = pets.id
        ORDER BY booking.id DESC
    `;

    var booking = await exe(sql);

    res.render("admin/booking.ejs", { booking });
});




// ------------------------------Enquiry page-----------------------------------

router.get("/enquiry", async (req, res) => {
    var enquiries = await exe("SELECT * FROM enquiry ORDER BY id DESC");
    res.render("admin/enquiry.ejs", { enquiries });
});



// ----------------------dog info-----------------------



router.get("/dog_info", async function(req, res) {
   var dogs = await exe("SELECT * FROM dog_info");
   res.render("admin/dog_info", { dogs });
});



// ----------------------------------book service ---------------------------------

router.post("/book-service", (req, res) => {
    console.log(req.body);   // test साठी

    res.send("Service booked successfully");
});


// --------------------------------- Dashboard------------------------------------


router.get("/dashboard", async (req, res) => {

    var pets       = await exe("SELECT COUNT(*) AS total FROM pets");
    var services   = await exe("SELECT COUNT(*) AS total FROM services");
    var doctors    = await exe("SELECT COUNT(*) AS total FROM team");
    var blogs      = await exe("SELECT COUNT(*) AS total FROM blogs");
    var booking    = await exe("SELECT COUNT(*) AS total FROM booking");
    var enquiry    = await exe("SELECT COUNT(*) AS total FROM enquiry");

    var latestBookings = await exe(`
        SELECT booking.*, pets.dog_image
        FROM booking
        LEFT JOIN pets ON booking.pet_id = pets.id
        ORDER BY booking.id DESC
        LIMIT 5
    `);

    res.render("admin/dashboard.ejs", {
        pets      : pets[0].total,
        services  : services[0].total,
        doctors   : doctors[0].total,
        blogs     : blogs[0].total,
        booking   : booking[0].total,
        enquiry   : enquiry[0].total,
        latestBookings
    });
});


//--------------------------- services edit / delete button ---------------------------

// EDIT SERVICE
router.get('/edit-service/:id', (req, res) => {
    const id = req.params.id;

    connection.query(
        "SELECT * FROM services WHERE id = ?",
        [id],
        (err, result) => {
            res.render('admin/edit-service', { service: result[0] });
        }
    );
});


// DELETE SERVICE
router.post('/delete-service/:id', (req, res) => {
    const id = req.params.id;

    connection.query(
        "DELETE FROM services WHERE id = ?",
        [id],
        (err) => {
            res.redirect('/admin/services');
        }
    );
});







// fixed admin credentials
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "12345";

// login page
router.get("/login", (req, res) => {
    res.render("admin/login", { msg: null });
});

// login check
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        req.session.admin = true;
        res.redirect("/admin/dashboard");
    } else {
        res.render("admin/login", {
            msg: "Invalid username or password"
        });
    }
});

// dashboard (protected)
router.get("/dashboard", (req, res) => {
    if (!req.session.admin) {
        return res.redirect("/admin/login");
    }
    res.render("admin/dashboard");
});

// logout
router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/admin/login");
});







module.exports = router;