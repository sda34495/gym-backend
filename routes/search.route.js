const express = require("express");
const {
  searchFighters,
  searchCoach,
} = require("../controllers/SearchController"); // Adjust the path

const router = express.Router();

router.get("/fighters", searchFighters);
router.get("/coaches", searchCoach);

module.exports = router;
