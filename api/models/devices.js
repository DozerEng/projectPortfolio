const mongoose = require("mongoose");

const deviceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    currentState: { type: Number, required: true },
    deviceImage: { type: String, required: true}
});

module.exports = mongoose.model('Device', deviceSchema);