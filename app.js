//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({
    extended: true
}))
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

const userSchema = new mongoose.Schema ({
    email: String,
    Password: String
});

userSchema.plugin(encrypt, {secret : process.env.SECRET, encryptedFields: ['Password']}); 

const User = new mongoose.model("user", userSchema);

app.get("/", function (req, res) {
    res.render("home");
})

app.get("/login", function (req, res) {
    res.render("login");
})

app.get("/register", function (req, res) {
    res.render("register");
})

app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.username,
        Password: req.body.password
    })
    newUser.save(function (err) {
        if (err) {
            console.log(err)
        } else {
            res.render("secrets")
        }
    });
})

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.Password === password) {
                    res.render("secrets");
                } else {
                    console.log(foundUser.Password);
                }
            }
        }
    })
})


app.listen(3000, function () {
    console.log("Server started at port 3000");
})