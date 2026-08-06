const { body } = require("express-validator");

module.exports.loginDataValidations = [
   body("email")
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email."),
   body("password")
      .notEmpty()
      .withMessage("Password is required."),
];