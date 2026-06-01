export const errorHandler = (err, req, res, next) => {
    console.log('From error handler', err)
    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}