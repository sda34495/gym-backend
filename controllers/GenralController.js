const Coach = require("../models/Coach");
const Member = require("../models/Member");
const Post = require("../models/Post");

const deleteResource = async (req, res) => {
  try {
    const gymId = req.userId;
    const { resource_id, resource_type } = req.body;

    if (resource_type === "member") {
      const member = await Member.findById(resource_id);
      member.isDeleted = true;
      await member.save();
      return res.status(200).json({ status: true });
    }

    if (resource_type == "coach") {
      const coach = await Coach.findById(resource_id);
      coach.isDeleted = true;
      await coach.save();
      return res.status(200).json({ status: true });
    }
    if (resource_type == "listing") {
      const post = await Post.findById(resource_id);
      post.isDeleted = true;
      await post.save();
      return res.status(200).json({ status: true });
    }

    res
      .status(200)
      .json({ status: false, message: "Failed to Delete Record." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { deleteResource };
