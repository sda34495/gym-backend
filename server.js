const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDb = require("./config/Config.js");


const userRoutes = require("./routes/user.route.js"); // Adjust path accordingly
const memberRoutes = require("./routes/member.route.js"); // Adjust path accordingly
const coachesRoutes = require("./routes/coach.route.js"); // Adjust path accordingly
const messageRoutes = require("./routes/message.route.js");
const feedsRoutes = require("./routes/feeds.route.js");
const searchRoutes = require("./routes/search.route.js");
const uploadRoutes = require("./routes/upload.route.js");
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

app.use("/api/users", userRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/coaches", coachesRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/feeds", authMiddleware, feedsRoutes);
app.use("/api/search", authMiddleware, searchRoutes);
app.use("/api/uploads", authMiddleware, uploadRoutes);
const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white
  );
});
