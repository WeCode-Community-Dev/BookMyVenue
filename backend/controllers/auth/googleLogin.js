const Users = require("../../models/user");
const { USER_ROLES } = require("../../constants/user");
const { signAuthToken } = require("../../utils/jwt");
const { verifyGoogleIdToken, toPublicUser } = require("./shared");

// POST /auth/googleLogin
// Body: { idToken } — the Google ID token from the frontend.
// Google login is for customers only; venue owners use the email/password
// flow. Verifies the token, creates the customer if new (or enforces that an
// existing account is a customer), and returns our own app JWT.
async function googleLogin(req, res) {
   try {
      const { idToken } = req.body || {};
      if (!idToken) {
         return res.status(400).json({ message: "idToken is required" });
      }

      // 1. Verify the token really came from Google and is meant for us(this application).
      let profile;
      try {
         profile = await verifyGoogleIdToken(idToken);
      } catch (err) {
         return res
            .status(401)
            .json({ error: err.message, message: "Invalid Google token" });
      }

      // 2. Email is the primary identity key — find the existing user by it.
      let user = await Users.findOne({ email: profile.email });

      if (user) {
         // Google login only ever produces customers. A non-customer account
         // (e.g. a venue owner) must use its own login flow — refuse here.
         if (user.role !== USER_ROLES.CUSTOMER) {
            return res.status(409).json({
               message:
                  "This email is already registered for a different account type. Use a different email to log in as a customer.",
            });
         }
         // Keep Google-sourced fields fresh and link googleId if missing.
         user.googleId = profile.googleId;
         user.name = user.name || profile.name; // first priority is for the existing name (Maybe user sets their name themeselves from the user profile edit page)
         user.picture = user.picture || profile.picture; // first priority is for the existing picture
         await user.save();
      } else {
         user = await Users.create({
            googleId: profile.googleId,
            email: profile.email,
            name: profile.name,
            picture: profile.picture,
            role: USER_ROLES.CUSTOMER,
         });
      }

      // 3. Issue our own app JWT for subsequent authenticated requests.
      const token = signAuthToken(user);

      return res
         .status(200)
         .json({ data: { token, user: toPublicUser(user) } });
   } catch (err) {
      return res
         .status(500)
         .json({ error: err.message, message: "Login failed" });
   }
}

module.exports = googleLogin;
