const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signup = async (req, res) => {
  const { name, username, email, phone, password, type } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser.username == username) {
      return res.status(400).json({ message: "UserName  already taken." });
    }

    if (existingUser.phone == phone) {
      return res.status(400).json({ message: "Phone Number Already Exist." });
    }

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
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
      "your_jwt_secret"
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
      "your_jwt_secret"
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

module.exports = { signup, login, editUser, getClubDetails };
