const { body } = require("express-validator");

module.exports.signUpDataValidations = [
   body("name")
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage("Name is required and must be between 3 and 50 characters."),
   body("email")
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email."),
   body("password")
      .isStrongPassword({
         minLength: 8,
         minLowercase: 1,
         minUppercase: 1,
         minNumbers: 1,
         minSymbols: 1,
      })
      .withMessage("Password must contain at least 8 characters with 1 lowercase, 1 uppercase, 1 number and 1 symbol."),
   body("confirmPassword")
      .exists()
      .withMessage("Confirm password is required.")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Passwords do not match."),
];