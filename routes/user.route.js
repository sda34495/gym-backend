const express = require("express");
const { signup, login, editUser } = require("../controllers/UserController"); // Adjust the path
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.put("/edit", authMiddleware, editUser);

router.post("/login", login);

module.exports = router;
