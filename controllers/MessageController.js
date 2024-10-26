const { default: mongoose } = require("mongoose");
const Message = require("../models/Message");
const User = require("../models/User");

const sendMessage = async (req, res) => {
  try {
    const { receiverId, body } = req.body;
    const senderId = req.userId;
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "Sender or receiver not found" });
    }

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

const replyToMessage = async (req, res) => {
  try {
    const { messageId, body } = req.body;
    const senderId = req.userId;
    const originalMessage = await Message.findById(messageId);

    if (!originalMessage) {
      return res.status(404).json({ message: "Message to reply to not found" });
    }

    const receiverId = originalMessage.sender;

    const replyMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      body,
      replyMessageId: messageId,
      isReply: true,
    });

    await replyMessage.save();

    res
      .status(201)
      .json({ message: "Reply sent successfully", data: replyMessage });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send reply", error: error.message });
  }
};

const getMyMessages = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    // if (!user) {
    //   return res.status(404).json({ message: "User not found" });
    // }

    // const messages = await Message.find({
    //   $or: [{ sender: userId }, { receiver: userId }],
    // })
    //   .populate("sender receiver", "-password")
    //   .populate({
    //     path: "replyMessageId",
    //     select: "body sender createdAt",
    //     populate: {
    //       path: "sender",
    //       select: "name email",
    //     },
    //   });
    const messages = await Message.aggregate([
      // Match messages where the user is either the sender or receiver
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(userId) },
            { receiver: new mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      // Lookup (populate) the sender and receiver
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "senderInfo",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "receiver",
          foreignField: "_id",
          as: "receiverInfo",
        },
      },
      // Lookup (populate) the reply message
      {
        $lookup: {
          from: "messages", // Collection to join (Message model)
          localField: "replyMessageId",
          foreignField: "_id",
          as: "replyMessage",
        },
      },
      // Unwind sender, receiver, and replyMessage arrays (since $lookup returns arrays)
      { $unwind: { path: "$senderInfo", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$receiverInfo", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$replyMessage", preserveNullAndEmptyArrays: true } },
      // Project to control which fields to include and rename replyMessageId to replyMessage
      {
        $project: {
          sender: {
            _id: "$senderInfo._id",
            name: "$senderInfo.name",
            email: "$senderInfo.email",
          },
          receiver: {
            _id: "$receiverInfo._id",
            name: "$receiverInfo.name",
            email: "$receiverInfo.email",
          },
          body: 1,
          createdAt: 1,
          // Include and rename replyMessageId to replyMessage
          replyMessage: {
            _id: "$replyMessage._id",
            body: "$replyMessage.body",
            sender: {
              _id: "$replyMessage.sender",
              name: "$replyMessage.senderInfo.name",
              email: "$replyMessage.senderInfo.email",
            },
            createdAt: "$replyMessage.createdAt",
          },
        },
      },
    ]);

    res
      .status(200)
      .json({ message: "Messages retrieved successfully", data: messages });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve messages", error: error.message });
  }
};

// const getMyMessages = async (req, res) => {
//   try {
//     const receiverId = req.userId;

//     // Validate user ID
//     console.log("hello world..");
//     const user = await User.findById(receiverId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const messages = await Message.find({
//       $or: [{ sender: receiverId }, { receiver: receiverId }],
//     })
//       .populate("sender receiver", "name email")
//       .sort("createdAt");
//     res
//       .status(200)
//       .json({ message: "Messages retrieved successfully", data: messages });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to retrieve messages", error: error.message });
//   }
// };

const readMessage = async (req, res) => {
  try {
    const { messageId } = req.body;
    const userId = req.userId;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.receiver.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to mark this message as read",
      });
    }

    message.read = true;
    await message.save();

    res.status(200).json({ message: "Message marked as read", data: message });
  } catch (error) {
    res.status(500).json({
      message: "Failed to mark message as read",
      error: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  getMyMessages,
  replyToMessage,
  readMessage,
};
