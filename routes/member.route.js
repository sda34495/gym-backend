const express = require("express");
const {
  createMember,
  getMembers,
  getMemberById,
  deleteMember,
  editMember,
} = require("../controllers/MembersController");


const router = express.Router();

// Route to create a new member (Protected)
router.post("/create", createMember);
router.put("/:id", editMember);

// Route to get all members
router.get("/", getMembers);

// Route to get a specific member by ID
router.get("/:id", getMemberById);

// Route to delete a member (Protected)
router.delete("/:id", deleteMember);

module.exports = router;
