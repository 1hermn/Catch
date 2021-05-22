const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminScheme = new Schema({
    name: String,
    id: Number,
    isDirector: Boolean,
    stats: {
        mails: Number,
        actions: Number,
        news: Number,
    }
});

const Admin = mongoose.model("Admin", adminScheme);
module.exports = {
    Admin: Admin
}