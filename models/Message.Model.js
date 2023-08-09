const mongoose = require("mongoose");
const ChatModel = require("./Chat.Model");
const message_schema = mongoose.Schema(
    {
        sender: {
            type: String
        },
        content: {
            type: String,
            trim: true
        },
        file: Array,
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: ChatModel
        },
        readBy: [{
            type: String
        }]
    },
    { timestamps: { createdAt: "createdAt" } }
);
let Message = mongoose.model("Message", message_schema);
module.exports = Message;