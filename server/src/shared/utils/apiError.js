class ApiError extends Error {

    constructor(
       statusCode,
       message,
       errors = [],
       stack = ''
    ) {
 
       super(message);
 
       this.success = false;
       this.statusCode = statusCode;
       this.message = message;
       this.errors = errors;
 
       if (stack) {
          this.stack = stack;
       } else {
          Error.captureStackTrace(this, this.constructor);
       }
    }
 }
 
 export default ApiError;