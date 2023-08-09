const chatModel = require("../models/Chat.Model");
const fs = require("fs");
const moment = require("moment");
const crypto = require("crypto");

exports.create = async (req, res) => {
    try {
        const { chatName, chatLogo, chatDesc, isGroupChat, users, groupAdmin } = req.body;
        let existingChat = await chatModel.findOne({ users: { $all: users }, isGroupChat: false });
        if (existingChat) {
            res.status(200).json({ err: 300, msg: "Chat already exist" });
        } else {
            let newChat = new chatModel({
                chatName, chatDesc, isGroupChat, users, groupAdmin
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
                    newChat.chatLogo.push({ type: file.mimetype, path: final_path });
                }
            }
            let NEWCHAT = await newChat.save();
            res.status(200).json({ err: 200, msg: "Chat created successfully", data: NEWCHAT });
        }
    } catch (error) {
        res.status(500).json({ err: 500, msg: error.toString() });
    }
}

// Group edit
exports.edit = async (req, res) => {
    try {
        const { chatId, chatName, chatDesc, isGroupChat, users, groupAdmin } = req.body;
        let existingChat = await chatModel.findById(chatId);
        if (!existingChat) {
            return res.status(200).json({ err: 300, msg: "Chat not found" });
        }
        let updateChatObj = {
            chatName, chatDesc, isGroupChat, users, groupAdmin
        }
        let existingFilePaths = existingChat.chatLogo.map((file) => file.path);
        let updatedFilePaths = [];
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
                updatedFilePaths.push(final_path);
                console.log({ type: file.mimetype, path: final_path });
                updateChatObj.chatLogo.push({ type: file.mimetype, path: final_path });
            }
        }
        let updatedChat = await chatModel.findByIdAndUpdate(chatId, { $set: updateChatObj }, { new: true });
        if (updatedChat) {
            let filesToDelete = existingFilePaths.filter((filePath) => !updatedFilePaths.includes(filePath));
            filesToDelete.forEach((filePath) => {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`Failed to unlink file: ${filePath}`);
                    }
                });
            });
        }
        res.status(200).json({ err: 200, msg: "Chat updated successfully", data: updatedChat });
    } catch (error) {
        res.status(500).json({ err: 500, msg: error.toString() });
    }
}

// list of all chats
exports.ListAll = async (req, res) => {
    try {
        const { userId, isGroupChat } = req.body;
        let chats = await chatModel.find({ users: { $in: userId }, isGroupChat })
            .sort({ createdAt: "desc" });

        if (chats.length === 0) {
            res.status(200).json({ err: 300, msg: "No chats found" })
        } else {
            res.status(200).json({ err: 200, msg: "Chats found successfully", data: chats });
        }
    } catch (error) {
        res.status(500).json({ err: 500, msg: error.toString() });
    }
}

exports.deleteChat = async (req, res) => {
    try {
        const { chatId } = req.body;
        let chat = await chatModel.findByIdAndDelete(chatId);
        if (!chat) {
            res.status(200).json({ err: 300, msg: "Failed to delete chat" });
        } else {
            res.status(200).json({ err: 200, msg: "Chat deleted successfully" });
        }
    } catch (error) {
        res.status(500).json({ err: 500, msg: error.toString() });
    }
}