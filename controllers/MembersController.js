const Member = require("../models/Member");

const createMember = async (req, res) => {
  const {
    name,
    dob,
    startDate,
    age,
    homeTown,
    class: classCategory,
    experience,
    height,
    weight,
    stance,
    reach,
    records,
    sports,
    location,
  } = req.body;
  const gymId = req.userId;
  try {
    const member = new Member({
      name,
      dob,
      startDate,
      age,
      homeTown,
      class: classCategory,
      experience,
      height,
      weight,
      stance,
      reach,
      isActive: true,
      isDeleted: false,
      records,
      gymId,
      location,
      sports: sports,
    });

    await member.save();
    res.status(201).json({ message: "Member created successfully", member });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all members
const getMembers = async (req, res) => {
  try {
    const members = await Member.find({ isDeleted: false });
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a single member by ID
const getMemberById = async (req, res) => {
  const { id } = req.params;

  try {
    const member = await Member.findById(id);
    if (!member || member.isDeleted) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a member (soft delete)
const deleteMember = async (req, res) => {
  const { id } = req.params;

  try {
    const member = await Member.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(200).json({ message: "Member deleted successfully", member });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Edit Member API
const editMember = async (req, res) => {
  const { id } = req.params; // Get the member ID from the URL
  const {
    name,
    class: memberClass,
    experience,
    height,
    weight,
    stance,
    isActive,
  } = req.body; // Get editable fields from the request body

  try {
    // Find the member by ID
    const member = await Member.findById(id);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Update only the fields that are provided
    if (name) member.name = name;
    if (memberClass) member.class = memberClass;
    if (experience) member.experience = experience;
    if (height) member.height = height;
    if (weight) member.weight = weight;
    if (stance) member.stance = stance;
    if (typeof isActive !== "undefined") member.isActive = isActive;

    // Save the updated member
    await member.save();

    res.status(200).json({ message: "Member updated successfully", member });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { editMember };

module.exports = {
  createMember,
  getMembers,
  getMemberById,
  deleteMember,
  editMember,
};
