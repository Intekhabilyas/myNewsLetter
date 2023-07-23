const mongoose = require("mongoose");

const newsLetterSchema = new mongoose.Schema({
    name: String,
    email: String,
    type: String
});

module.exports = mongoose.model("Newsletter", newsLetterSchema);