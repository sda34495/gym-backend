const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const OTP = require("../models/Otp");
require("dotenv").config();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

function verifyOTP(inputOtp, storedOtp) {
  return inputOtp === storedOtp;
}

const requestOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Phone number not found" });
    }

    // Generate and save OTP
    const otp = generateOTP(); // Function to generate a random OTP
    const newOtp = new OTP({ userId: user._id, otp });
    await newOtp.save();

    // Here, you can integrate with a service to send the OTP via SMS
    // For example: smsService.sendOTP(phone, otp);

    res.status(200).json({ message: "OTP sent to your phone", otp: otp });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const setNewPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password and update the user
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Temporary token has expired" });
    }
    res.status(500).json({ message: "Server error", error });
  }
};

const verifyPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isVerified = await bcrypt.compare(password, user.password);

    res.status(200).json({
      message: isVerified ? "verification success" : "verification failed.",
      isVerified,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Temporary token has expired" });
    }
    res.status(500).json({ message: "Server error", error });
  }
};

const verifyOTPController = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Phone number not found" });
    }

    const otpRecord = await OTP.findOne({ userId: user._id, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Delete the OTP record once validated
    await OTP.deleteOne({ userId: user._id });

    // Generate a temporary token (e.g., valid for 15 minutes) for password reset
    const tempToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m", // Token is valid for 15 minutes
    });

    res.status(200).json({
      message: "OTP verified successfully",
      tempToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const signup = async (req, res) => {
  const { name, username, email, phone, password, type } = req.body;

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      username,
      phone,
      password: hashedPassword,
      type,
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, type: user.type },
      process.env.JWT_SECRET
    );
    res.status(201).json({
      message: "User created successfully",
      user: {
        email: user.email,
        name: user.name,
        type: user.type,
        _id: user._id,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, type: user.type },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      token,
      user: {
        email: user.email,
        name: user.name,
        type: user.type,
        _id: user._id,
      },
      message: "Logged in successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const editUser = async (req, res) => {
  const { name, address, sports, manager, headCoach } = req.body;
  const userId = req.userId; // Assuming you have middleware that sets userId from JWT

  try {
    // Find the user by ID and update only the provided fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          name: name || undefined,
          address: address || undefined,
          sports: sports || undefined,
          manager: manager,
          headCoach: headCoach,
        },
      },
      { new: true, runValidators: true } // return the updated user, validate input
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
const getClubDetails = async (req, res) => {
  const userId = req.userId;

  try {
    let user = await User.findById(userId);

    // Destructure to remove the password field from the user object
    const { password, ...userObject } = user._doc; // Ensure to access the raw data using `_doc`

    res
      .status(200)
      .json({ message: "Details fetched successfully", user: userObject });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  signup,
  login,
  editUser,
  getClubDetails,
  verifyOTPController,
  setNewPassword,
  requestOTP,
  verifyPassword
};
