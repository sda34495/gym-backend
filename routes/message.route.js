const express = require("express");
const {
  sendMessage,
  getMyMessages,
  replyToMessage
} = require("../controllers/MessageController");

const router = express.Router();

router.post("/", sendMessage);
// router.get("/:userId", getMessages); // Retrieve messages for a user
router.get("/my/", getMyMessages); // Retrieve messages for a user
router.post("/reply/",replyToMessage)

module.exports = router;
