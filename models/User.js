const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["GYM", "PROMOTION","ADMIN"],
    },
    logo: {
      type: String,
    },
    address: {
      type: String,
    },
    manager: {
      type: String,
    },
    headCoach: {
      type: String,
    },
    sports: {
      type: [String],
    },
    isVerified: {
      type: Boolean,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
 
    status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionDate: {
    type: Date
  }
},

{
  timestamps: true,
}
);

const User = mongoose.model("User", userSchema);

module.exports = User;
