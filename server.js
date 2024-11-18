
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDb = require("./config/Config.js");
const colors = require("colors");

const userRoutes = require("./routes/user.route.js");
const memberRoutes = require("./routes/member.route.js");
const coachesRoutes = require("./routes/coach.route.js");
const messageRoutes = require("./routes/message.route.js");
const feedsRoutes = require("./routes/feeds.route.js");
const searchRoutes = require("./routes/search.route.js");
const uploadRoutes = require("./routes/upload.route.js");
const deleteRoutes = require("./routes/delete.route.js");
const authMiddleware = require("./middlewares/authMiddleware.js");
const { seedAdminUser } = require("./seeders/seedAdminUser.js");
const User = require("./models/User");

// dotenv configuration
dotenv.config();

// db configuration
connectDb();

// rest object
const app = express();

// middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Call seedAdminUser when the database connection is established
seedAdminUser().then(() => {
  console.log('Admin user seeding process completed'.cyan);
});

// temporary routes
app.get("/", (req, res) => {
  res.send("Hello World");
});



// New route for fetching users based on type and approval status
app.get("/api/users", authMiddleware, async (req, res) => {
  try {
    const { type, status } = req.query;
    let query = {};
    
    if (type) {
      query.type = type;
    }
    
    if (status) {
      query.status = status;
    }
    
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// New route for approving or rejecting user accounts
// app.post("/api/users/approve", authMiddleware, async (req, res) => {
//   try {
//     const { userId, action } = req.body;
    
//     if (!['approve', 'reject'].includes(action)) {
//       return res.status(400).json({ message: "Invalid action" });
//     }
    
//     const user = await User.findById(userId);
    
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
    
//     user.status = action === 'approve' ? 'approved' : 'rejected';
//     user.rejectionDate = action === 'reject' ? new Date() : null;
    
//     await user.save();
    
//     res.json({ message: `User ${action}d successfully`, user });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

app.post("/api/users/approve", authMiddleware, async (req, res) => {
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
    console.error('Error in approve/reject:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
});



app.use("/api/users", userRoutes);
app.use("/api/members", authMiddleware, memberRoutes);
app.use("/api/coaches", authMiddleware, coachesRoutes);
app.use("/api/messages", authMiddleware, messageRoutes);
app.use("/api/feeds", authMiddleware, feedsRoutes);
app.use("/api/search", authMiddleware, searchRoutes);
app.use("/api/uploads", authMiddleware, uploadRoutes);
app.use("/api/delete", authMiddleware, deleteRoutes);

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white
  );
});