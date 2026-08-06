const bcrypt = require("bcrypt");
const Users = require("../../models/user");
const { signAuthToken } = require("../../utils/jwt");
const { toPublicUser } = require("./shared");
const { USER_ROLES } = require("../../constants/user");

module.exports.venueOwnerSignUp = async (req, res) => {
   try {
      const {
         name,
         email,
         password,
      } = req.body;

      const passwordHash = await bcrypt.hash(password, 10);
      
      const user = new Users({
         name,
         email,
         password: passwordHash,
         role: USER_ROLES.VENUE_OWNER,
      });
      await user.save();
      
      let loginToken;
      try {
         loginToken = signAuthToken(user);
      } catch (error) {
         return res.status(201).json({
            message: "Your account was created, but we couldn't log you in automatically. Please log in with your email and password.",
         });
      }

      res.status(201).json({
         message: "Venue owner registration completed and logged in successfully",
         data: { token: loginToken, user: toPublicUser(user) },
      });
   } catch (error) {
      if (error.code === 11000) {
         return res.status(409).json({
            message: "An account with this email address already exists. Please use another email address",
         });
      }
      return res.status(500).json({ message: "Sign up failed", error: error.message });
   }
}