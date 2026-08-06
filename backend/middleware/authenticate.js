const Users = require("../models/user");
const { verifyAuthToken } = require("../utils/jwt");

// Protects routes that require a logged-in user.
// Expects an "Authorization: Bearer <token>" header carrying our app JWT.
// On success attaches the user document to req.user; otherwise 401.
async function authenticate(req, res, next) {
   try {
      const authHeader = req.headers.authorization || "";
      const [scheme, token] = authHeader.split(" ");

      if (scheme !== "Bearer" || !token) {
         return res.status(401).json({ message: "Authentication required" });
      }

      let payload;
      try {
         payload = verifyAuthToken(token);
      } catch (err) {
         return res.status(401).json({ message: "Invalid or expired token" });
      }

      const user = await Users.findById(payload.userId);
      if (!user || user.deletedAt) {
         return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      return next();
   } catch (err) {
      return res
         .status(500)
         .json({ error: err.message, message: "Authentication failed" });
   }
}

module.exports = authenticate;
