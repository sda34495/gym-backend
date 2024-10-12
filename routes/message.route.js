const express = require("express");
const {
  sendMessage,
  getMessages,
  getMyMessages,
} = require("../controllers/MessageController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, sendMessage);
router.get("/:userId", getMessages); // Retrieve messages for a user
router.get("/my", getMyMessages); // Retrieve messages for a user

module.exports = router;
