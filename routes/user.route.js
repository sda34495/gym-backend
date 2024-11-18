const express = require("express");
const {
  signup,
  login,
  editUser,
  getClubDetails,
  setNewPassword,
  requestOTP,
  verifyOTPController,
  verifyPassword,
  getAllUsers,
  approveUser,
  deleteUser
} = require("../controllers/UserController"); // Adjust the path
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/getAllUsers", authMiddleware, getAllUsers);
router.post("/approve", authMiddleware, approveUser);
router.post("/delete", authMiddleware, deleteUser);


router.post("/signup", signup);
router.put("/edit", authMiddleware, editUser);

router.post("/login", login);
router.get("/club-details", authMiddleware, getClubDetails);
router.post("/verify-otp", verifyOTPController);
router.post("/request-otp", requestOTP);

// Set new password using the temporary token
router.post("/set-new-password", authMiddleware, setNewPassword);
router.post("/verify-password", authMiddleware, verifyPassword);

module.exports = router;
