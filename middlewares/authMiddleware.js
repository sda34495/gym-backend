const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  let token = req.header("Authorization");
  if (!token)
    res.status(401).json({ message: "Authorization denied, no token" });
  token = token.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, "your_jwt_secret"); // Replace with your secret key
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
