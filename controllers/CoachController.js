const Coach = require("../models/Coach");

const createCoach = async (req, res) => {
  const {
    name,
    age,
    role,
    homeTown,
    experience,
    height,
    weight,
    stance,
    sport,
    location,
  } = req.body;
  const gymId = req.userId;
  try {
    const coach = new Coach({
      name,
      age,
      role,
      homeTown,
      experience,
      height,
      weight,
      stance,
      gymId,
      sport,
      location,
    });

    await coach.save();
    res.status(201).json({ message: "Coach created successfully", coach });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getCoaches = async (req, res) => {
  try {
    const coaches = await Coach.find();
    res.status(200).json(coaches);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getCoachById = async (req, res) => {
  const { id } = req.params;

  try {
    const coach = await Coach.findById(id);
    if (!coach) {
      return res.status(404).json({ message: "Coach not found" });
    }
    res.status(200).json(coach);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const updateCoach = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const coach = await Coach.findByIdAndUpdate(id, updates, { new: true });
    if (!coach) {
      return res.status(404).json({ message: "Coach not found" });
    }
    res.status(200).json({ message: "Coach updated successfully", coach });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const deleteCoach = async (req, res) => {
  const { id } = req.params;

  try {
    const coach = await Coach.findByIdAndDelete(id);
    if (!coach) {
      return res.status(404).json({ message: "Coach not found" });
    }
    res.status(200).json({ message: "Coach deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createCoach,
  getCoaches,
  getCoachById,
  updateCoach,
  deleteCoach,
};
