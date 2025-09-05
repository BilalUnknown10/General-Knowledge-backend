const jwt = require("jsonwebtoken");
const User = require("../Models/user_model");

const authMiddleware = async (req, res, next) => {
try {
  const token = req.headers?.authorization.replace("Bearer ", "").trim();

if (!token || token === undefined) {
  return res.status(401).json({ message: "No token" });
}
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select("-password");
  
  req.user = user;
  next();
} catch (err) {
  return res.status(401).json({ message: "Invalid or expired token", error: err.message });
}

};

module.exports = authMiddleware;