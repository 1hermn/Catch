const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const actionScheme = new Schema({
    text: String,
    id: Number
});

const Action = mongoose.model("Action", actionScheme);
module.exports = {
    Action: Action
}