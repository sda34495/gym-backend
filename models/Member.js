const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dob: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
    },
    homeTown: {
      type: String,
      required: true,
      trim: true,
    },
    class: {
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
    isActive: {
      type: Boolean,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    reach: {
      type: String,
      required: true,
      trim: true,
    },
    records: {
      wins: {
        type: Number,
        required: true,
        default: 0,
      },
      losses: {
        type: Number,
        required: true,
        default: 0,
      },
      draws: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sport: {
      type: String,
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

// Ensure geospatial index on location for efficient geolocation queries
memberSchema.index({ location: "2dsphere" });

const Member = mongoose.model("Member", memberSchema);

module.exports = Member;
