const jwt = require("jsonwebtoken");
const User = require("../Models/user_model");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    
    // Check if Authorization header is present and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized request" });
    }
    
    // Extract token from 'Bearer <token>'
    const token = authHeader.split(" ")[1];
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const decodedUser = await User.findById({_id : decoded.id});
    
    // Attach user data to request object (optional)
    req.user = decodedUser;

    // Proceed to next middleware or route handler
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token", error: err.message });
  }
};

module.exports = authMiddleware;