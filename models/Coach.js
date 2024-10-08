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
    age: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
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
      trim: true,
    }, //cm
    weight: {
      type: Number,
      required: true,
      trim: true,
    }, // lbs
    stance: {
      type: String,
      required: true,
      trim: true,
    },
    discipline: {
      type: String,
      required: true,
      trim: true,
    },
    sport: {
      type: String,
      required: true,
    },
    location: {
      // GeoJSON format to store coordinates
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
  },
  {
    timestamps: true,
  }
);

coachSchema.index({ location: "2dsphere" });
const Coach = mongoose.model("Coach", coachSchema);

module.exports = Coach;
