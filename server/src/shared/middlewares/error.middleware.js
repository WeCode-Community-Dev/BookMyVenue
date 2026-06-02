export const errorHandler = (
    error,
    req,
    res,
    next
 ) => {
 
    console.error(error);
 
    return res.status(
       error.statusCode || 500
    ).json({
       success: false,
       message:
          error.message || 'Internal Server Error',
       errors: error.errors || []
    });
 
 };