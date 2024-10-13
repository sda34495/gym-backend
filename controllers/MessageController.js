const Message = require("../models/Message"); // Assuming your model is in the models directory
const User = require("../models/User"); // Assuming you have a User model

// Send a Message
const sendMessage = async (req, res) => {
  try {
    const { receiverId, body } = req.body;
    // Validate sender and receiver IDs
    const senderId = req.userId;
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "Sender or receiver not found" });
    }

    // Create and save a new message
    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      body,
    });

    await message.save();

    res
      .status(201)
      .json({ message: "Message sent successfully", data: message });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send message", error: error.message });
  }
};

// Retrieve Messages for a User
const getMessages = async (req, res) => {
  try {
    const { userId } = req.params; // userId passed in request params

    // Validate user ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Retrieve messages where the user is either the sender or receiver
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    }).populate("sender receiver", "name email"); // Populating sender and receiver fields

    res
      .status(200)
      .json({ message: "Messages retrieved successfully", data: messages });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve messages", error: error.message });
  }
};
const getMyMessages = async (req, res) => {
  try {
    const receiverId = req.userId;

    // Validate user ID
    const user = await User.findById(receiverId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const messages = await Message.find({
      receiver: receiverId,
    }).populate("sender receiver", "name email");
    res
      .status(200)
      .json({ message: "Messages retrieved successfully", data: messages });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve messages", error: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getMyMessages
};
