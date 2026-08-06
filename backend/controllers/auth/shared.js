const { OAuth2Client } = require("google-auth-library");
const { googleClientId } = require("../../config/config");

// One shared verifier client for the whole app.
const googleClient = new OAuth2Client({ clientId: googleClientId });

// Verifies a Google ID token and returns the trusted profile claims.
// Throws if the token is invalid or not issued for our client id.
async function verifyGoogleIdToken(idToken) {
   const loginTicket = await googleClient.verifyIdToken({
      idToken,
      audience: googleClientId,
   });
   const payload = loginTicket.getPayload();
   return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name || "",
      picture: payload.picture || "",
   };
}

// Shape a User document for safe sending to the client (omit internal fields).
function toPublicUser(user) {
   return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      picture: user.picture,
      role: user.role,
   };
}

module.exports = { verifyGoogleIdToken, toPublicUser };
