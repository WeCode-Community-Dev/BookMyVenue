import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';

/**
 * Generates a signed JSON Web Token (JWT) containing user identifiers.
 * The token has a standard expiration duration of 7 days.
 * @param {number|string} id - The user database identifier
 * @param {string} email - The user email address
 * @param {string} role - The user authority role ('user', 'venue_owner', 'admin')
 * @returns {string} Signed JWT token string
 */
const generateToken = (id, email, role) => {
  return jwt.sign(
    { id, email, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * @desc    Register a new user profile with hashed credentials
 * @route   POST /api/auth/signup
 * @access  Public (Enforces lowercase emails, basic length limits, and restricts admin self-creation)
 */
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // 1. Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // 2. Check if user already exists
    const emailCheckResult = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (emailCheckResult.rows.length > 0) {
      return res.status(400).json({ message: 'A user with this email address already exists' });
    }

    // 3. Secure password hashing
    const salt = await bcrypt.genSalt(15);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Validate and restrict role to prevent unauthorized admin creations
    const userRole = (role === 'venue_owner' || role === 'user') ? role : 'user';

    // 4. Insert new user into database
    const insertResult = await query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name.trim(), email.toLowerCase().trim(), hashedPassword, userRole]
    );

    const newUser = insertResult.rows[0];

    // 5. Generate and send JWT response
    const token = generateToken(newUser.id, newUser.email, newUser.role);

    res.status(201).json({
      success: true,
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      token
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error during user registration. Please try again.' });
  }
};

/**
 * @desc    Authenticate user credentials and generate active session JWT token
 * @route   POST /api/auth/login
 * @access  Public (Validates email and bcrypt password match)
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // 2. Search for user by email
    const userResult = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = userResult.rows[0];

    // 3. Verify bcrypt-hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 4. Generate JWT
    const token = generateToken(user.id, user.email, user.role);

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error during login. Please try again.' });
  }
};
