const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');


const signupController = async (req, res) => {
    const {name,  email, password, role} = req.body;
    if(!name || !email || !password || !role) {
        return res.status(400).json({
            message: 'Name, email and password are required fields'
        });
    }

    try {
        //check if th user already exists
        const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
        if(existingUser.rows.length > 0){
            return res.status(400).json({
                message: 'An account with this ueamil already exist'
            });
        }
        //hashing the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //save the user to db
        const insertQuery = `
        INSERT INTO users (name, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role, created_at;
        `;

        const newUser = await db.query(insertQuery, [name,email,hashedPassword,role]);
        const user = newUser.rows[0];

        //generate jwt
        const token = jwt.sign(
            {id : user.id, email: user.email, role: user.role},
            process.env.JWT_SECRET,
            { expiresIn: '24h'}
        );

        return res.status(201).json({
        message: 'User registered successfully',
        token,
        user
        });
    }catch (error) {
    console.error('Signup Error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = signupController;