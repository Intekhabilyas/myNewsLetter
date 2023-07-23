const express = require("express")
const app = express();
const path = require("path");
const https = require("https")
const bodyParser = require("body-parser")
const userlocation = path.join(__dirname, "app2.js");
const Newsletter = require(userlocation);
const mongoose = require("mongoose");
const PORT = 3000;

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))
mongoose.connect("mongodb://localhost:27017/newsLetterDB")

const myFile = path.join(__dirname, "../public/signup.html");

app.get("/", (req, res) => {
    res.sendFile(myFile)
});

app.post("/", (req, res) => {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;

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

    const url = "https://us21.api.mailchimp.com/3.0/lists/668f66d2be";
    const options = {
        method: "POST",
        auth: "intekhabilyas004:9b5888169025ce43ce11bb3805674c68-us21"
    }
    const request = https.request(url, options, (response) => {
        var mynewFile;
        if (response.statusCode === 200)
            mynewFile = path.join(__dirname, "../public/success.html")
        else
            mynewFile = path.join(__dirname, "../public/failure.html");

        res.sendFile(mynewFile);

        var type1;
        if (response.statusCode === 200)
            type1 = "Accepted";
        else
            type1 = "Not Accepted"


        const user = new Newsletter({
            name: firstName + " " + lastName,
            email: email,
            type: type1
        });
        user.save();


        response.on("data", (data) => {
            console.log(JSON.parse(data))
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", (req, res) => {
    res.redirect("/");
});

app.listen(PORT, () => {
    console.log(`server is running on  http://localhost:${PORT}`)
});

// API KEY
// 9b5888169025ce43ce11bb3805674c68-us21

//List ID
// 668f66d2be