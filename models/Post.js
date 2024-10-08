const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Post schema
const postSchema = new Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
    },
    postType: {
      type: String,
      enum: [
        "Replacement Fighter",
        "Seeking Opponent",
        "Sparring Partners",
        "Seminars",
        "Open House Events",
      ],
      required: true,
    },
    sport: {
      type: [String], // Array of strings for relevant sports
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"], // 'Point' for GeoJSON location
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create a 2dsphere index for geolocation queries
postSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Post", postSchema);
