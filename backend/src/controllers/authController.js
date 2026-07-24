import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";
import generateOtp from "../utils/generateOtp.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";
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


        await sendEmail(email, otp,);
        await userModel.create({
            name,
            email,
            phone,
            password: hashedPassword,
            otp,
            otpExpiresAt: expiresAt,
        });


        return res.status(201).json({
            success: true,
            message: "Registration successful. Please check your email for the verification OTP.",
        });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({
            success: false,
            message: "Registration failed. Please try again.",
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
            return res.status(401).json({
                success: false,
                message: "Invalid email or OTP"
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
            sameSite:
                process.env.NODE_ENV === "production"
                    ? "none"
                    : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
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

//change password
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






const PHONE_REGEX = /^[6-9]\d{9}$/;
const GENDER_VALUES = ["male", "female", "other"];

//logged in user 

const getMe = async (req, res) => {
    try {
        const user = req.user;

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                roles: user.roles,
                profileImage: user.profileImage,
                bio: user.bio,
                address: user.address,
                dob: user.dob,
                gender: user.gender,
                city: user.city,
                state: user.state,
                isEmailVerified: user.isEmailVerified,
                isActive: user.isActive,
            },
        });
    } catch (error) {
        console.error("Error in getMe:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateMe = async (req, res) => {
    try {
        const user = req.user;

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message:
                    "Your account has been disabled. Please contact support.",
            });
        }

        const { name, phone, bio, address, city, state, dob, gender } = req.body;

        const hasProfileUpdate =
            name !== undefined ||
            phone !== undefined ||
            bio !== undefined ||
            address !== undefined ||
            city !== undefined ||
            state !== undefined ||
            dob !== undefined ||
            gender !== undefined;

        if (!hasProfileUpdate) {
            return res.status(400).json({
                success: false,
                message: "No valid profile fields to update",
            });
        }

        if (name !== undefined) {
            const trimmedName = String(name).trim();
            if (!trimmedName) {
                return res.status(400).json({
                    success: false,
                    message: "Name cannot be empty",
                });
            }
            if (trimmedName.length > 100) {
                return res.status(400).json({
                    success: false,
                    message: "Name must be 100 characters or fewer",
                });
            }
            user.name = trimmedName;
        }

        if (phone !== undefined) {
            const trimmedPhone = String(phone).trim();
            if (!PHONE_REGEX.test(trimmedPhone)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid phone number",
                });
            }
            if (trimmedPhone !== user.phone) {
                const existingPhone = await userModel.findOne({ phone: trimmedPhone });
                if (
                    existingPhone &&
                    existingPhone._id.toString() !== user._id.toString()
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "Phone number already exists",
                    });
                }
            }
            user.phone = trimmedPhone;
        }

        if (bio !== undefined) {
            const trimmedBio = String(bio).trim();
            if (trimmedBio.length > 500) {
                return res.status(400).json({
                    success: false,
                    message: "Bio must be 500 characters or fewer",
                });
            }
            user.bio = trimmedBio;
        }

        if (address !== undefined) {
            const trimmedAddress = String(address).trim();
            if (trimmedAddress.length > 300) {
                return res.status(400).json({
                    success: false,
                    message: "Address must be 300 characters or fewer",
                });
            }
            user.address = trimmedAddress;
        }

        if (city !== undefined) {
            const trimmedCity = String(city).trim();
            if (trimmedCity.length > 100) {
                return res.status(400).json({
                    success: false,
                    message: "City must be 100 characters or fewer",
                });
            }
            user.city = trimmedCity;
        }

        if (state !== undefined) {
            const trimmedState = String(state).trim();
            if (trimmedState.length > 100) {
                return res.status(400).json({
                    success: false,
                    message: "State must be 100 characters or fewer",
                });
            }
            user.state = trimmedState;
        }

        if (gender !== undefined) {
            const trimmedGender = String(gender).trim().toLowerCase();
            if (!GENDER_VALUES.includes(trimmedGender)) {
                return res.status(400).json({
                    success: false,
                    message: "Gender must be male, female, or other",
                });
            }
            user.gender = trimmedGender;
        }

        if (dob !== undefined) {
            if (dob === null || dob === "") {
                user.dob = null;
            } else {
                const parsedDob = new Date(dob);
                if (Number.isNaN(parsedDob.getTime())) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid date of birth",
                    });
                }
                if (parsedDob > new Date()) {
                    return res.status(400).json({
                        success: false,
                        message: "Date of birth cannot be in the future",
                    });
                }
                user.dob = parsedDob;
            }
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                roles: user.roles,
                profileImage: user.profileImage,
                bio: user.bio,
                address: user.address,
                dob: user.dob,
                gender: user.gender,
                city: user.city,
                state: user.state,
                isEmailVerified: user.isEmailVerified,
                isActive: user.isActive,
            },
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Phone number already exists",
            });
        }

        console.error("Error in updateMe:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateProfileImage = async (req, res) => {
    try {
        const user = req.user;

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message:
                    "Your account has been disabled. Please contact support.",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a profile image",
            });
        }

        if (user.profileImagePublicId) {
            await deleteFromCloudinary(user.profileImagePublicId);
        }

        const result = await uploadToCloudinary(req.file.buffer);

        user.profileImage = result.secure_url;
        user.profileImagePublicId = result.public_id;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile image updated",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                roles: user.roles,
                profileImage: user.profileImage,
                bio: user.bio,
                address: user.address,
                dob: user.dob,
                gender: user.gender,
                city: user.city,
                state: user.state,
                isEmailVerified: user.isEmailVerified,
                isActive: user.isActive,
            },
        });
    } catch (error) {
        console.error("Error in updateProfileImage:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

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
            message: "Logout failed. Please try again.",
        });
    }
}


//become provider , initially custumer then provider in one click

const becomeProvider = async (req, res) => {
    try {

        const user = req.user;

        if (user.roles.includes("provider")) {
            return res.status(400).json({
                success: false,
                message: "You are already a provider",
            });
        }

        user.roles.push("provider");

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Provider account created successfully",
            roles: user.roles,
        });

    } catch (error) {
        console.error("Become provider error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export {
    register,
    verifyEmail,
    resendOtp,
    login,
    forgotPassword,
    resetPassword,
    getMe,
    updateMe,
    updateProfileImage,
    logout,
    becomeProvider,
};