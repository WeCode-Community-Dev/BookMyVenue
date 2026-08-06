const { validationResult } = require("express-validator");

module.exports.handleExpressValidatorErrors = (req, res, next) => {
   const dataValidationErrors = validationResult(req);
   if(!dataValidationErrors.isEmpty()) {
      return res
         .status(400)
         .json({ 
            message: "Request failed",
            errors: dataValidationErrors.array().map((err) => err.msg)
         });
   } else next();
}