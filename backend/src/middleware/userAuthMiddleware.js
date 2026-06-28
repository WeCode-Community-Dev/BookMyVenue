import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access. Please login.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id)
    .select("-password -otp -otpExpiresAt");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access. User not found.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact support.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in authMiddleware:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized access. Invalid token.",
    });
  }
};


export default authMiddleware;