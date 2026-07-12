import User from "../models/User.js";
import { generateAccessToken, verifyRefreshToken, generateRefreshToken } from "./tokenService.js";
import bcrypt from 'bcryptjs'

const allowedRoles = ["user", "owner"]
export const registerUser = async ({ name, email, password, role }) => {
    if (!allowedRoles.includes(role)) {
        throw new Error("Invalid role for registration");
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
        throw new Error("User already exists..");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role
    });
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
        user,
        accessToken,
        refreshToken
    }
}

export const loginUser = async ({ email, password }) => {

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new Error("User not exist!");
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid email or password!");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
        user,
        accessToken,
        refreshToken
    }
}

export const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) {
        throw new Error("Token is missing");
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);

    if (!user) {
        throw new Error("User not found");
    }
    const newAccessToken = generateAccessToken(user);

    return {
        accessToken: newAccessToken
    }
}