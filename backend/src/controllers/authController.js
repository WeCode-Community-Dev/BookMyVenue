import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwr from 'jsonwebtoken';
const generateToken=(id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET,{ expiresIn: '30d' })
}
// RegisterUser
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExist = await User.findOne({ email })

        if (userExist) {
            return res.status(400).json({ message: "User already exist" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
            token: generateToken(user._id)
        });

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

// LoginUser
export const loginUser = async () => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })


        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        }
        else {
            return res.status(400).json({ message: "User not exist" })
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}