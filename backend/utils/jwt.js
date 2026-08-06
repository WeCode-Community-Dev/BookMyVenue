const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpiresIn } = require("../config/config");

// Signs our own app JWT. Payload is intentionally small: the user id and role
// are all the API needs to authorize requests.
function signAuthToken(user) {
   const payload = { userId: user._id.toString() };
   const expiresIn = jwtExpiresIn[user.role];
   return jwt.sign(payload, jwtSecret, { expiresIn });
}

// Verifies an app JWT and returns its decoded payload.
// Throws if the token is missing, expired, or tampered with.
function verifyAuthToken(token) {
   return jwt.verify(token, jwtSecret);
}

module.exports = { signAuthToken, verifyAuthToken };
