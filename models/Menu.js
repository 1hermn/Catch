const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newScheme = new Schema({
    address: String,
});

const New = mongoose.model("New", newScheme);
module.exports = {
    New: New
}