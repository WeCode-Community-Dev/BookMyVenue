const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');


const loginController = async (req, res) => {
    const {email, password} =  req.body;
    if(!email || !password){
        return res.status(400).json({
            message: 'Email and password are required fields'
        });
    }

    try {
        const userExist = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if(userExist.rows.length === 0 ){
            return res.status(400).json({
                message: 'Invalid email or password'
            });
        }

        const user = userExist.rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if(!isPasswordValid){
            return res.status(400).json({
                message: 'invalid Password'
            });
        }

        //generate jwt
        const token = jwt.sign(
            {id: user.id, email: user.email, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: '24h'}
        );

        return res.status(200).json({
            message: 'Login Succesful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    }catch(error){
        console.error('Login error', error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

module.exports = loginController;