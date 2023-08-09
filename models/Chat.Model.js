const mongoose = require("mongoose");
const UserModel = require("./UserModel");
const Schema = mongoose.Schema;

const chat = new Schema(
    {
        chatName: {
            type: String,
            trim: true,
        },
        chatLogo: Array,
        chatDesc: {
            type: String,
        },
        isGroupChat: {
            type: Boolean,
            default: false
        },
        users: [
            {
                type: String
            },
        ],
        groupAdmin: [
            {
                type: String,
            },
        ]
    },
    { timestamps: { createdAt: "createdAt" } }
);

module.exports = mongoose.model("chat", chat);