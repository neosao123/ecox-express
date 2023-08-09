const UserModel = require("../models/UserModel");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const config = require("../config/config");
const ChatModel = require("../models/Chat.Model");

// exports.signUp = async (req, res) => {
//     try {
//         const {
//             avtar,
//             userName,
//             firstName,
//             lastName,
//             email,
//             gender,
//             birthDate,
//             city,
//             district,
//             state,
//             country,
//             phonenumber,
//             about,
//             password,
//         } = req.body;

//         const userEmailExists = await UserModel.findOne({ email });
//         const userPhoneExists = await UserModel.findOne({ phonenumber });

//         if (!phonenumber) {
//             res.status(200).json({ err: 300, msg: "Phone Number is Required" });
//         }
//         if (phonenumber.length < 10) {
//             res.status(200).json({ err: 300, msg: "Phone Number atleast 10 digit" });
//         }
//         if (!firstName) {
//             res.status(200).json({ err: 300, msg: "First Name is Required" });
//         }
//         if (!lastName) {
//             res.status(200).json({ err: 300, msg: "Last Name is Required" });
//         }
//         if (!email) {
//             res.status(200).json({ err: 300, msg: "Email is Required" });
//         }
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//             return res.status(200).json({ err: 300, msg: "Please enter a valid email" });
//         }
//         const passregex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{}|;':",./<>?])[A-Za-z\d!@#$%^&*()_+\-=[\]{}|;':",./<>?]{8,}$/;
//         if (!passregex.test(password)) {
//             return res.status(200).json({ err: 300, msg: "password must contain at least eight characters, including at least one number and include both lower and uppercase letters and special characters" });
//         }
//         if (userEmailExists) {
//             return res.status(200).json({ err: 300, msg: "Email already exists" });
//         } else if (userPhoneExists) {
//             return res.status(200).json({ err: 300, msg: "Phone number already exists" });
//         } else if (userPhoneExists && userEmailExists) {
//             return res.status(200).json({ err: 300, msg: "Email and Phone already exists" });
//         } else {
//             const salt = await bcrypt.genSalt(10);
//             const hashedpassword = await bcrypt.hash(password, salt);
//             const regUser = new UserModel({
//                 userName,
//                 firstName,
//                 lastName,
//                 email,
//                 gender,
//                 birthDate,
//                 city,
//                 district,
//                 state,
//                 country,
//                 phonenumber,
//                 about,
//                 password: hashedpassword,
//             });
//             if (req.file) {
//                 const timestamp = Date.now();
//                 const randomString = Math.random().toString(36).substring(2);
//                 const fileExtension = path.extname(req.file.originalname);
//                 const fileName = `avtar-${timestamp}_${randomString}${fileExtension}`;
//                 const filePath = path.join('uploads/profile', fileName);
//                 fs.renameSync(req.file.path, filePath);
//                 regUser.avtar = fileName;
//             }
//             let userdata = await regUser.save();
//             const group = await ChatModel.findOne({ isGroupChat: true });
//             if (group) {
//                 await ChatModel.findByIdAndUpdate(group._id, { $push: { users: userdata._id } }, { new: true });
//             }

//             const token = jwt.sign({ id: userdata._id }, config.SECRETE_KEY, { expiresIn: '24d' });
//             res.status(200).json({ err: 200, msg: "User Registered successfully", data: userdata, token })
//         }
//     } catch (error) {
//         res.status(500).json({ err: 500, msg: error.toString() });
//     }
// }

// exports.logIn = async (req, res) => {
//     try {
//         const { email, phonenumber, password } = req.body;
//         let user = await UserModel.findOne({ $or: [{ email: email }, { phonenumber: phonenumber }] });
//         if (!user) {
//             return res.status(200).json({ err: 300, msg: "User does not exist" });
//         }
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(200).json({ err: 300, msg: 'Invalid email or password' });
//         }
//         const token = jwt.sign({ id: user._id }, config.SECRETE_KEY, { expiresIn: '24d' });
//         user.toObject({ ...user, userId: user._id })
//         res.status(200).json({ err: 200, msg: "Logged in successfully", data: user, token });
//     } catch (error) {
//         res.status(500).json({ err: 500, msg: error.toString() });
//     }
// }


exports.addUserToGroup = async (req, res) => {
    try {
        const { groupId, userId } = req.body;
        const chatGroup = await ChatModel.findById(groupId);
        if (!chatGroup) {
            return res.status(200).json({ err: 404, msg: 'Chat group not found' });
        }
        const isUserExist = chatGroup.users.includes(userId);
        if (isUserExist) {
            return res.status(200).json({ err: 300, msg: 'User already exists in the group' });
        }
        await ChatModel.findByIdAndUpdate(groupId, { $push: { users: userId } }, { new: true });
        res.status(200).json({ err: 200, msg: 'User added to the group successfully' });
    } catch (error) {
        res.status(500).json({ err: 500, msg: error.toString() });
    }
};
