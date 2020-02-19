/*

Schema for users, includes first/last name, email, password, and privilege level.
Used for log in services.

To do: add expiration for guest accounts

*/

const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    }, //regex for email validation ^
    password: { type: String, required: true },
    privilege: { type: String, required: true } //admin, user, guest
}); //add more details about user accounts later, devices, homes, etc...

module.exports = mongoose.model('User', userSchema);