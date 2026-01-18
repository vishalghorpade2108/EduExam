import jwt from "jsonwebtoken";
import Teacher from "../models/Teacher.model.js";

/**
 * AUTH MIDDLEWARE
 * Protects private routes
 */
const authMiddleware = async (req, res, next) => {
  try {
    // 1️⃣ Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Find teacher
    const teacher = await Teacher.findById(decoded.id).select("-password");
    if (!teacher) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // 4️⃣ Attach teacher to request
    req.user = {
      id: teacher._id,
      role: "teacher",
      email: teacher.email,
    };

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;