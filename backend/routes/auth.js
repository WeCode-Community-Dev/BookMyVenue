const express = require("express");
const googleLogin = require("../controllers/auth/googleLogin");
const getMe = require("../controllers/auth/getMe");
const authenticate = require("../middleware/authenticate");
const { signUpDataValidations } = require("../middleware/signUpDataValidations");
const { loginDataValidations } = require("../middleware/loginDataValidations");
const { handleExpressValidatorErrors } = require("../middleware/handleExpressValidatorErrors");
const { venueOwnerSignUp } = require("../controllers/auth/venueOwnerSignUp");
const { login } = require("../controllers/auth/login");

const router = express.Router();

router.post("/googleLogin", googleLogin);
router.get("/me", authenticate, getMe);

router.post(
   "/venueOwner/signup",
   signUpDataValidations,
   handleExpressValidatorErrors,
   venueOwnerSignUp
);

router.post(
   "/login",
   loginDataValidations,
   handleExpressValidatorErrors,
   login
);

module.exports = router;
