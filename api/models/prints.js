/*

Schema for other projects, includes name, state.
Used for log in services.

To do: add expiration for guest accounts

*/

const mongoose = require("mongoose");

const printsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    mainImage: { type: String, required: true },
    title: { type: String, required: true},
    description: { type: String, default: "" }
});

module.exports = mongoose.model('Prints', printsSchema);