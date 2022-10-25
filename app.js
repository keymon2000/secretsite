//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();


app.set("view engine", "ejs");
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {
    useNewUrlParser: true
});

const userschema = new mongoose.Schema({
    email: String,
    password: String
});



userschema.plugin(encrypt, {
    secret: process.env.SECRT,
    encryptedFields: ["password"]
});


const User = new mongoose.model("User", userschema);

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});



app.post("/register", function (req, res) {
    const newusr = new User({
        email: req.body.username,
        password: req.body.password
    });
    newusr.save(function (err) {
        if (!err) {
            res.render("secrets")
        } else {
            console.log(err);
        }
    });
});


app.post("/login", function (req, res) {

    const username = req.body.username;
    const password = req.body.password;
    User.findOne({
        email: username
    }, function (err, founduser) {
        if (err) {
            console.log(err);
        } else {
            if (founduser) {
                if (founduser.password === password) {
                    res.render("secrets");
                    // console.log(founduser.password);
                }
            } else {

            }
        }
    });
});







app.listen(3000, function () {
    console.log("Running on port 3000.");
})