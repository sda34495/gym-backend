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

const approveUser = async (req, res) => {
  try {
    const { userId, action } = req.body;
    
    if (!userId || !['approve', 'reject'].includes(action)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid request parameters" 
      });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }
    
    user.status = action === 'approve' ? 'approved' : 'rejected';
    if (action === 'reject') {
      user.rejectionDate = new Date();
    }
    
    await user.save();
    
    res.json({ 
      success: true,
      message: `User ${action}d successfully`,
      user 
    });
  } catch (error) {
    console.error('Error in approveUser:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude the password field
    
    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({
      success: true,
      users: users,
      message: "Users fetched successfully"
    });
  } catch (error) {
    console.error('Error to fetch Users:', error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching users",
      error: error.message 
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false,
        message: "User ID is required" 
      });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }
    
    await User.findByIdAndDelete(userId);
    
    res.json({ 
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
};

const signup = async (req, res) => {
  const { name, email, phone, password, type } = req.body;

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    // Check if the user was rejected within the last 2 days
    const rejectedUser = await User.findOne({
      $or: [{ email }, { phone }],
      status: 'rejected',
      rejectionDate: { $gte: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }
    });

    if (rejectedUser) {
      return res.status(400).json({ message: "Your account creation request was recently rejected. Please try again after 2 days." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      type,
      status: 'pending' 
    });

    await user.save();

    res.status(201).json({
      message: "User created successfully. Your account is pending approval.",
      user: {
        email: user.email,
        name: user.name,
        type: user.type,
        _id: user._id,
        status: user.status
      }
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
      return res.status(400).json({ message: "Email does't exist." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password." });
    }

    if (user.status === 'pending') {
      return res.status(403).json({ message: "Your account is pending approval" });
    }

    if (user.status === 'rejected') {
      return res.status(403).json({ message: "Your account has been rejected" });
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
        status: user.status
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
  verifyPassword,
  getAllUsers,
  approveUser,
  deleteUser
};

