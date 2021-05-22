const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newScheme = new Schema({
    text: String,
    photo: String,
    id: Number
});

const New = mongoose.model("New", newScheme);
module.exports = {
    New: New
}