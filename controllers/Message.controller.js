const MessageModel = require("../models/Message.Model");
const moment = require("moment");
const crypto = require("crypto");
const fs = require("fs");

exports.create = async (req, res) => {
    try {
        const { sender, content, file, chat, readBy } = req.body;
        let newMessage = new MessageModel({
            sender, content, file, chat, readBy
        });
        if (req.files && req.files.length > 0) {
            for (let i = 0; i < req.files.length; i++) {
                const file = req.files[i];
                const tmp_path = req.files[i].path;
                const timeStamp = moment().valueOf();
                const randomString = crypto.randomBytes(10).toString('hex');
                const fileExtentsion = req.files[i].originalname.split(".");
                const file_final_name = `${randomString}-${timeStamp}.${fileExtentsion[fileExtentsion.length - 1]}`;
                const final_path = "uploads/chatmedia/" + file_final_name;
                fs.renameSync(tmp_path, final_path, (err) => {
                    if (err) {
                        return req.files[i].fieldname + " file linking failed";
                    }
                });
                newMessage.file.push({ type: file.mimetype, path: final_path });
            }
        }
        let result = await newMessage.save();
        res.status(200).json({ err: 200, msg: "Message added successfully", data: result });
    } catch (error) {
        res.status(500).json({ err: 500, msg: error.toString() });
    }
}


exports.listAll = async (req, res) => {
    try {
        const { search, chat, currUser, page } = req.body;
        const skip = 10;
        const pageNumber = parseInt(page) || 1;
        const skipCount = skip * (pageNumber - 1);
        let query = {};

        if (search !== "") {
            query.content = { $regex: search, $options: "i" };
        }
        if (chat) {
            query.chat = chat;
        }
        let result = await MessageModel.find(query)
            .sort({ createdAt: -1 })
            .skip(skipCount)
            .limit(skip)
            .exec();
        res.status(200).json({ err: 200, msg: "Messages Found", data: result });

    } catch (error) {
        res.status(500).json({ err: 500, msg: error.toString() });
    }
}


exports.delete = async (req, res) => {
    try {
        const { messageId } = req.body;
        let deleteMessage = await MessageModel.findByIdAndDelete(messageId);
        res.status(200).json({ err: 200, msg: "Message deleted successfully", data: deleteMessage });
    } catch (error) {
        res.status(500).json({ err: 500, msg: error.toString() });
    }
}