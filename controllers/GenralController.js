const Coach = require("../models/Coach");
const Member = require("../models/Member");

const deleteResource = async (req, res) => {
  try {
    const gymId = req.userId;
    const { resource_id, resource_type } = req.body;

    if (resource_type === "memeber") {
      const member = await Member.findById(resource_id);
      member.isDeleted = true;
      return res.status(200).json({ status: true });
    }

    if (resource_type == "coach") {
      const coach = await Coach.findById(resource_id);
      coach.isDeleted = true;
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
