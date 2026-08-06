const { toPublicUser } = require("./shared");

// GET /auth/me — returns the currently authenticated user.
// authenticate has already verified the token and attached req.user.
async function getMe(req, res) {
   try {
      return res.status(200).json({ data: { user: toPublicUser(req.user) } });
   } catch (err) {
      return res
         .status(500)
         .json({ error: err.message, message: "Failed to fetch user" });
   }
}

module.exports = getMe;
