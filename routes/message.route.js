const express = require("express");
const {
  sendMessage,
  getMessages,
} = require("../controllers/MessageController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, sendMessage); // Send a message
router.get("/:userId", getMessages); // Retrieve messages for a user

module.exports = router;