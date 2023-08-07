require("dotenv").config();
const express = require("express")
const app = express();
const path = require("path");
const https = require("https")
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
const { connectMongoose, Accepted, NotAccepted } = require("./app2");
const passport = require("passport");
const { initializedGoogle, authenticateGoogle } = require("./passportGoogle");
const expressSession = require("express-session");
const { error } = require("console");

connectMongoose();
initializedGoogle(passport);
app.use(express.static("public"))
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
    expressSession({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

const myFile = path.join(__dirname, "../public/signup.html");
const myHomePage = path.join(__dirname, "../public/home.html");
var mynewFile = path.join(__dirname, "../public/success.html")

app.get("/", (req, res) => {
    res.sendFile(myHomePage);
})
app.get("/signup", (req, res) => {
    res.sendFile(myFile)
});

app.get("/failure", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/failure.html"))
});
//login through Google
app.get("/auth/Google", passport.authenticate("google", { scope: ["email", "profile"] }));
app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/failure", successRedirect: "/loading" }));

app.get("/loading", authenticateGoogle, (req, res) => {

    let firstName = req.user._json.given_name;
    let lastName = req.user._json.family_name;
    let email = req.user.emails[0].value;

    var data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };
    const jsonData = JSON.stringify(data);

    const url = process.env.LIST;
    const options = {
        method: "POST",
        auth: "hello:" + process.env.APIKEY
    }
    const request = https.request(url, options, (response) => {

        if (response.statusCode !== 200)
            mynewFile = path.join(__dirname, "../public/failure.html");
        res.sendFile(mynewFile);

        response.on("data", (data) => {
            console.log(JSON.parse(data))
            var type1;
            if (response.statusCode !== 200 || JSON.parse(data).error_count != 0)
                type1 = "Not Accepted " + JSON.parse(data).errors[0].error_code;
            else
                type1 = "Accepted"

            if (type1 === "Accepted") {
                var user = new Accepted({
                    name: firstName + " " + lastName,
                    email: email,
                    type: type1
                });
            }
            else {
                user = new NotAccepted({
                    name: firstName + " " + lastName,
                    email: email,
                    type: type1
                });
            }
            user.save().then(() => console.log("User is saved"));

            if (JSON.parse(data).error_count != 0)
                res.redirect("/failure")
        });
    });

    request.write(jsonData);
    request.end();



})

//locally save

app.post("/:userID", (req, res) => {
    var weburl = req.params.userID;
    console.log(weburl)


    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;

    var data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };
    const jsonData = JSON.stringify(data);

    const url = process.env.LIST;
    const options = {
        method: "POST",
        auth: "hello:" + process.env.APIKEY
    }
    const request = https.request(url, options, (response) => {

        if (response.statusCode !== 200)
            mynewFile = path.join(__dirname, "../public/failure.html");
        res.sendFile(mynewFile);

        response.on("data", (data) => {
            console.log(JSON.parse(data))
            var type1;
            if (response.statusCode !== 200 || JSON.parse(data).error_count != 0)
                type1 = "Not Accepted " + JSON.parse(data).errors[0].error_code;
            else
                type1 = "Accepted"

            if (type1 === "Accepted") {
                var user = new Accepted({
                    name: firstName + " " + lastName,
                    email: email,
                    type: type1
                });
            }
            else {
                user = new NotAccepted({
                    name: firstName + " " + lastName,
                    email: email,
                    type: type1
                });
            }
            user.save().then(() => console.log("User is saved"));

            if (JSON.parse(data).error_count != 0)
                res.redirect("/failure")
        });



    });

    request.write(jsonData);
    request.end();
});



app.post("/failure", (req, res) => {
    res.redirect("/");
});

app.listen(process.env.PORT, () => {
    console.log(`server is running on  http://localhost:${process.env.PORT}`)
});

