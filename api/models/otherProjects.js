/*

Schema for other projects, includes name, state.
Used for log in services.

To do: add expiration for guest accounts

*/

const mongoose = require("mongoose");

const otherProjectsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    projectImage: { type: String, required: true },
    title: { type: String, required: true},
    shortDescription: { type: String, default: "" },
    longDescription: { type: String, default: ""}
});

module.exports = mongoose.model('OtherProjects', otherProjectsSchema);