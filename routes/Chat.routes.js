const multer = require("multer");
const chatController = require("../controllers/Chat.Controller");
const router = require("express").Router();
const path = require("path");
const auth = require("../middleware/auth");

const upload = multer({
    dest: path.join(__dirname, "../uploads/chatmedia/temp"),
});
const fields = [{ name: "chatLogo" }];

router.post("/create", upload.any(fields), chatController.create);
router.post("/edit", upload.any(fields), chatController.edit);
router.post("/listall", chatController.ListAll);
router.post("/delete", chatController.deleteChat);

module.exports = router;