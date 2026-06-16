import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";
import generateOtp from "../utils/generateOtp.js";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        const phoneRegex = /^[6-9]\d{9}$/;

        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                success: false,
                message: "Invalid phone number"
            });
        }

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must contain uppercase, lowercase and number",
            });
        }
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        }

        const existingEmail = await userModel.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const existingPhone = await userModel.findOne({ phone });
        if (existingPhone) {
            return res.status(400).json({
                success: false,
                message: "Phone number already exists"
            });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const { otp, expiresAt } = generateOtp();


        await userModel.create({
            name,
            email,
            phone,
            password: hashedPassword,
            otp,
            otpExpiresAt: expiresAt,
        });

        await sendEmail(email, otp,);

        return res.status(201).json({
            success: true,
            message: "User registered successfully. Please check your email for the OTP.",
        });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }

}

//verify the regsterd users through otp

const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified"
            });
        }

        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        if (user.otpExpiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired"
            });
        }

        user.isEmailVerified = true;
        user.otp = null;
        user.otpExpiresAt = null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
        });
    } catch (error) {
        console.error("Email verification error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }

}


//resend otp in verify email page

const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified"
            });
        }

        const { otp, expiresAt } = generateOtp();
        user.otp = otp;
        user.otpExpiresAt = expiresAt;
        await user.save();

        await sendEmail(email, otp);

        return res.status(200).json({
            success: true,
            message: "OTP resent successfully. Please check your email.",
        });
    } catch (error) {
        console.error("Resend OTP error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

//login of the user
const login = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: "Please verify your email first"
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account has been disabled. Please contact support."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            });
        }

        user.lastLogin = new Date();
        await user.save();


        const token = jwt.sign(
            {
                id: user._id,
                roles: user.roles,
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });


        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                roles: user.roles,
                profileImage: user.profileImage,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }


}


const forgotPassword = async (req, res) => {

    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const { otp, expiresAt } = generateOtp();
        user.otp = otp;
        user.otpExpiresAt = expiresAt;
        await user.save();

        await sendEmail(user.email, otp, "reset");

        return res.status(200).json({
            success: true,
            message: "OTP sent to your email. Please check your inbox.",
        });
    }   
    catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }

}

const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email, OTP and new password are required"
            });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
         if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message: "Password must contain 8 characters, uppercase, lowercase and number"
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        if (user.otpExpiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.otp = null;
        user.otpExpiresAt = null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successful",
        });
    } catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};






//logged in user 

const getMe = async (req, res) => {
    try {
        const user= {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            phone: req.user.phone,
            roles: req.user.roles,
            profileImage: req.user.profileImage,
            bio: req.user.bio,
            address: req.user.address,
            dob: req.user.dob,
            gender: req.user.gender,
            city: req.user.city,
            state: req.user.state,
            isEmailVerified: req.user.isEmailVerified,
            isActive: req.user.isActive,
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {   
        console.error("Error in getMe:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const logout = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while logging out",
        });
    }
}



export { register, verifyEmail, resendOtp, login, forgotPassword, resetPassword, getMe, logout };