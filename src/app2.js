const mongoose = require("mongoose");

exports.connectMongoose = () => {
    mongoose.connect("mongodb://localhost:27017/newsLetterDB")
        .then((e) => console.log(`connection stabilish`))
        .catch((e) => console.log(e))

}
const newsLetterSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        require: true,
    },
    type: String
});

exports.Accepted = mongoose.model("Accepted", newsLetterSchema);
exports.NotAccepted = mongoose.model("NotAccepted", newsLetterSchema);