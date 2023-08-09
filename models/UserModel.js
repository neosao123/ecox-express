const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    avtar: {
        type: String,
    },
    userName: {
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    birthDate: {
        type: Date,
    },
    city: {
        type: String,
    },
    district: {
        type: String,
    },
    state: {
        type: String,
    },
    country: {
        type: String,
    },
    phonenumber: {
        type: String,
    },
    about: {
        type: String,
    },
    password: {
        type: String,
    }
}, { timestamp: true });

module.exports = mongoose.model("users", userSchema);