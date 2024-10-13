const express = require("express");
const router = express.Router();
const {
  getPublicListings,
  getMyListings,
  createListing,
  editListing,
  deleteListing,
} = require("../controllers/FeedsController");

// Fetch public listings with filters and sorting
router.get("/", getPublicListings);

// Fetch user's listings
router.get("/my/", getMyListings);

// Create a new listing
router.post("/", createListing);

// Edit a user's listing
router.put("/posts/:id", editListing);

// Delete a user's listing
router.delete("/post-delete/:id", deleteListing);

module.exports = router;
