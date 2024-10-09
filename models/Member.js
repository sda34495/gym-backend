const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dob: {
      type: Date, // Changed from String to Date
      required: true,
    },
    startDate: {
      type: String, // Could use Date but restricted to month/year input
      required: true,
      trim: true,
    },
    homeTown: {
      type: String, // Optional, if using location from map dropbox
      required: true,
      trim: true,
    },
    height: {
      type: Number, // Store in cm
      required: true,
    },
    weight: {
      type: Number, // Store in kg
      required: true,
    },
    reach: {
      type: Number, // Store in cm
      required: true,
    },
    stance: {
      type: String,
      enum: ["orthodox", "southpaw", "switcher"], // Ensure only these values are allowed
      required: true,
      trim: true,
    },
    sports: [
      {
        sport: {
          type: String,
          // required: true,
          enum: [
            "Boxing",
            "MMA",
            "BJJ",
            "Kickboxing",
            "Muay Thai",
            "Judo",
            "Karate",
            "Wrestling",
            "Taekwondo",
          ], // Restrict to approved sports
        },
        class: {
          type: String,
          // required: true,
          enum: [
            "White collar",
            "Amateur",
            "Professional",
            "White",
            "Blue",
            "Purple",
            "Brown",
            "Black",
            "N Class",
            "C Class",
            "B Class",
            "A Class",
            "Yellow",
            "Orange",
            "Green",
            "Red",
            "N/A",
          ],
        },
      },
    ],
    records: [
      {
        sport: {
          type: String,
          // required: true,
          enum: [
            "Boxing",
            "MMA",
            "BJJ",
            "Kickboxing",
            "Muay Thai",
            "Judo",
            "Karate",
            "Wrestling",
            "Taekwondo",
          ], // Sport-specific records
        },
        class: {
          type: String,
          // required: true,
        },
        wins: {
          type: Number,
          default: 0,
        },
        losses: {
          type: Number,
          default: 0,
        },
        draws: {
          type: Number,
          default: 0,
        },
      },
    ],
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym", // Assuming it's associated with a Gym, previously 'User'
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure geospatial index on location for efficient geolocation queries
memberSchema.index({ location: "2dsphere" });

const Member = mongoose.model("Member", memberSchema);

module.exports = Member;
