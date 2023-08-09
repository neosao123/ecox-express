const MessageController = require("../controllers/Message.controller");
const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const upload = multer({
    dest: path.join(__dirname, "../uploads/chatmedia/temp"),
});

const fields = [{ name: "file" }];
router.post("/create", upload.any(fields), MessageController.create);
router.post("/listall", MessageController.listAll);
router.post("/delete", MessageController.delete);
module.exports = router;