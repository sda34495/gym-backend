const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDb = require("./config/Config.js");
const multer = require("multer");
const userRoutes = require("./routes/user.route.js"); // Adjust path accordingly
const memberRoutes = require("./routes/member.route.js"); // Adjust path accordingly
const coachesRoutes = require("./routes/coach.route.js"); // Adjust path accordingly
const messageRoutes = require("./routes/message.route.js");
const feedsRoutes = require("./routes/feeds.route.js");
const searchRoutes = require("./routes/search.route.js");
const authMiddleware = require("./middlewares/authMiddleware.js");
require("colors");

//dotenv configration
dotenv.config();

// db configration
connectDb();

//rest object
const app = express();

//middleware

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// temporary routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

// -------------------------------- Multer start --------------------------------
// Set storage engine
const storage = multer.diskStorage({
  destination: "./uploads/", // Folder where files will be stored
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    ); // Filename format
  },
});
// Initialize upload variable with multer configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb); // Custom file type checking
  },
}).single("myFile"); // 'myFile' matches the name attribute in the input form

// Check file type function
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mimetype
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!"); // If file type is not allowed
  }
}

// Create a route for file upload
app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).send({ message: err }); // Handle error
    } else {
      if (req.file == undefined) {
        res.status(400).send({ message: "No file selected!" }); // No file selected
      } else {
        res.send({
          message: "File uploaded successfully",
          file: `uploads/${req.file.filename}`,
        }); // Success response
      }
    }
  });
});

app.use("/api/users", userRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/coaches", coachesRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/feeds", authMiddleware, feedsRoutes);
app.use("/api/search", authMiddleware, searchRoutes);
const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white
  );
});
