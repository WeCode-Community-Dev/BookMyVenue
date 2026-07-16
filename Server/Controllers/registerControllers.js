import { userModel } from "../Models/registerModel.js";
import bcrypt from "bcryptjs";
import { generateOtp, getOtpHtml } from "../utilities/utils.js";
import { sendMail } from "../Services/emailServices.js";
import { otpModel } from "../Models/otpModel.js";
import jwt from "jsonwebtoken";
import { sessionModel } from "../Models/sessionModel.js";

const handleSignUp = async (req, res) => {
  try {
    console.log("data..", req.body);

    const { userName, image, email, number, password } = req.body;
    if (!userName || !email || !number || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const isRegistered = await userModel.findOne({ email });
    if (isRegistered) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email..",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await userModel.create({
      userName,
      image,
      email,
      number,
      password: hashedPassword,
    });

    const otp = generateOtp();
    const html = getOtpHtml(otp);

    const otpHash = await bcrypt.hash(otp, saltRounds);
    await otpModel.create({
      email: email,
      user: user._id,
      otpHash,
    });

    await sendMail(email, "OTP Verification", `Your OTP code is${otp}`, html);

    res.status(200).json({
      message: "User registered successfully",
      user: {
        userName: user.userName,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      message: error.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpDoc = await otpModel.findOne({
      email,
    });

    if (!otpDoc) {
      return res.status(400).json({
        message: "no OTP for this mail",
      });
    }

    const isMatch = bcrypt.compare(otp.toString(), otpDoc.otpHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    const user = await userModel.findByIdAndUpdate(otpDoc.user, {
      isVerified: true,
    });

    await otpModel.deleteMany({
      user: otpDoc.user,
    });

    return res.status(200).json({
      message: "user verified successfully",
      user: {
        userName: user.userName,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const handleSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await userModel.findOne({ email });
    console.log("this is user..", user);

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password in !user",
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        message: "Email not verified",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password in match",
      });
    }

    const refreshToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const saltRounds = 10;

    const hashedRefresh = await bcrypt.hash(refreshToken, saltRounds);

    const session = await sessionModel.create({
      user: user._id,
      hashedRefreshToken: hashedRefresh,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    const accessToken = await jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m",
      },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      samesite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Logged successfully",
      user: {
        userId: user._id,
        userName: user.userName,
        email: user.email,
        number: user.number,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log("token..", req.cookies.refreshToken);

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token not found",
      });
    }

    const decoded = await jwt.verify(refreshToken, process.env.JWT_SECRET);
    console.log("edcc..", decoded);

    const session = await sessionModel.findOne({
      user: decoded.id,
      revoked: false,
    });
    console.log("session", session);
    const user = await userModel.findOne({
      _id: decoded.id,
    });
    console.log("user...in refresh", user);

    if (!session) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    const accessToken = jwt.sign(
      {
        id: decoded.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m",
      },
    );

    const newRefreshToken = jwt.sign(
      {
        id: decoded.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const saltRounds = 10;
    const newHashedRefresh = await bcrypt.hash(newRefreshToken, saltRounds);

    session.hashedRefreshToken = newHashedRefresh;
    await session.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Access token refreshed successfully",
      accessToken,
      user: {
        userId: decoded.id,
        userName: user.userName,
        email: user.email,
        number: user.number,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const handleGetMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(404).json({
        message: "token not found",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    return res.status(200).json({
      message: "user fetched successfully",
      user: {
        userName: user.userName,
        email: user.email,
        number: user.number,
      },
    });
  } catch (error) {
    console.log("error", error);
  }
};

const handleLogout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token not found",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    console.log("dec..", decoded);

    const session = await sessionModel.findOne({
      user: decoded.id,
      revoked: false,
    });

    if (!session) {
      return res.status(400).json({
        message: "Invalid refresh token",
      });
    }

    session.revoked = true;
    await session.save();

    res.clearCookie("refreshToken");

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

const handleLogoutAll = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token not found",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    await sessionModel.updateMany(
      {
        user: decoded.id,
        revoked: false,
      },
      {
        revoked: true,
      },
    );

    res.clearCookie("refreshToken");

    res.status(200).json({
      message: "Logged out from all devices successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const user = await userModel.find();
    if (!user) {
      return res.status(400).json({
        message: "No user found..",
      });
    }
    return res.status(200).json({
      message: "Got the users",
      users: user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

const getOrganizer = async (req, res) => {
  try {
    const { id } = req.params;

    const organizer = await userModel.findOne({ _id: id });

    if (!organizer) {
      return res.status(400).json({
        message: "No organizer found...",
      });
    }

    return res.status(200).json({
      message: "Got the Organizer",
      organizer: organizer,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

export {
  handleSignUp,
  verifyEmail,
  handleSignIn,
  refreshToken,
  handleGetMe,
  handleLogoutAll,
  handleLogout,
  getAllUsers,
  getOrganizer,
};
