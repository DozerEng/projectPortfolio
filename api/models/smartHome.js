const mongoose = require("mongoose");

const smartHomeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    device: { type: mongoose.Schema.Types.ObjectId, ref: "Device", required: true}, //ref important keyword for relations
    home: { type: String, default: "unassigned device" }
});

module.exports = mongoose.model('SmartHome', smartHomeSchema);