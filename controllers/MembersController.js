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
    console.log('server error is : ', error.message)
  }
};

// Get all members
const getMembers = async (req, res) => {
  try {
    const gymId = req.userId;
    const members = await Member.find({ isDeleted: false, gymId: gymId });
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
    dob,
    homeTown,
    startDate,
    class: memberClass,
    experience,
    height,
    weight,
    stance,
    isActive,
    reach,
    sports, // An array of sports the member competes in
    records, // Wins, losses, and draws for each sport
    location, // GeoJSON location object (coordinates)
  } = req.body; // Get editable fields from the request body

  try {
    // Find the member by ID
    const member = await Member.findById(id);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Update only the fields that are provided
    if (name) member.name = name;
    if (dob) member.dob = dob;
    if (homeTown) member.homeTown = homeTown;
    if (startDate) member.startDate = startDate;
    if (memberClass) member.class = memberClass;
    if (experience) member.experience = experience;
    if (height) member.height = height;
    if (weight) member.weight = weight;
    if (stance) member.stance = stance;
    if (reach) member.reach = reach;
    if (typeof isActive !== "undefined") member.isActive = isActive;

    // If sports are provided, update the member's sports array
    if (sports) member.sports = sports;

    // If records are provided, update the records
    if (records) member.records = records;

    // If location is provided, update the location (GeoJSON coordinates)
    if (location && location.coordinates) member.location = location;

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
