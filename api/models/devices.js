const mongoose = require("mongoose");

const deviceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    currentState: Number
});

module.exports = mongoose.model('Device', deviceSchema);