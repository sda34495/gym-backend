const express = require("express");
const {
  createCoach,
  getCoaches,
  getCoachById,
  updateCoach,
  deleteCoach,
} = require("../controllers/CoachController");
const auth = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", createCoach);
router.get("/", getCoaches);
router.get("/:id", getCoachById);
router.put("/:id", updateCoach);
router.delete("/:id", deleteCoach);

module.exports = router;
