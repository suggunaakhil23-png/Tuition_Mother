const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name: String,
    clas: Number,
    fee: Number,
    month: Date,
    status: String
});

module.exports = mongoose.model("data1", schema);
