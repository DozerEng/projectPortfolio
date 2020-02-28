/*

Schema for devices, includes name, state.
Used for log in services.

To do: add expiration for guest accounts

*/

const mongoose = require("mongoose");

const deviceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    currentState: { type: Number },
    mainImage: { type: String, required: true },
    secondImage: { type: String },
    thirdImage: { type: String },
    forthImage: { type: String },
    fifthImage: { type: String },
    sixthImage: { type: String },
    status: { type: String, default: "Offline"},
    configurationType: { type: String, required: true }
});

module.exports = mongoose.model('Device', deviceSchema);