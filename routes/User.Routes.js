const router = require("express").Router();
const userController = require("../controllers/User.Controller");
const multer = require("multer");

const imgconfig = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./uploads/profile");
    },
    filename: (req, file, callback) => {
        callback(null, `image-${Date.now()}.${file.originalname}`);
    },
});

const upload = multer({
    storage: imgconfig,
});

// router.post("/signup", upload.single('avtar'), userController.signUp);
// router.post("/login", userController.logIn);
router.post("/add", userController.addUserToGroup);

module.exports = router;