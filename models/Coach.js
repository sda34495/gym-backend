const mongoose = require("mongoose");

const coachSchema = new mongoose.Schema(
  {
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
      type: Date, // Changed from String to Date
    },
    role: {
      type: [String], // Allow multiple roles
      enum: [
        "Head Coach",
        "Coach",
        "Personal Trainer",
        "Administrator",
        "S&C Coach",
        "Physiotherapist",
        "Doctor",
      ],
      required: true,
    },
    homeTown: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      years: {
        type: Number,
        required: true,
      },
      months: {
        type: Number,
        required: true,
      },
    },
    height: {
      type: Number,
      required: true,
    }, // in cm
    weight: {
      type: Number,
      required: true,
    }, // in lbs or kg
    stance: {
      type: String,
      enum: ["orthodox", "southpaw", "switcher"],
      required: true,
    },
    sport: {
      type: [String], // Allow multiple sports
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
      ],
      required: true,
    },
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
      default: false,
    },
    profile_url: {
      type: String,
    },
    isDeleted: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

coachSchema.index({ location: "2dsphere" });
const Coach = mongoose.model("Coach", coachSchema);

module.exports = Coach;
