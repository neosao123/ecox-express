const router = require("express").Router();
const userRoutes = require("./User.Routes");
const chatRoutes = require("./Chat.routes");
const messageRoutes = require("./Message.Routes");

router.use("/api/user", userRoutes);
router.use("/api/chat", chatRoutes);
router.use("/api/message", messageRoutes);
module.exports = router;    