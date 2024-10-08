const express = require("express");
const {
  createMember,
  getMembers,
  getMemberById,
  deleteMember,
  editMember,
} = require("../controllers/MembersController");
const auth = require("../middlewares/authMiddleware");

const router = express.Router();

// Route to create a new member (Protected)
router.post("/create", auth, createMember);
router.put("/:id", auth, editMember);

// Route to get all members
router.get("/", getMembers);

// Route to get a specific member by ID
router.get("/:id", getMemberById);

// Route to delete a member (Protected)
router.delete("/:id", auth, deleteMember);

module.exports = router;
