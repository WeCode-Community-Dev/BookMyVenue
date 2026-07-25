export const sendSuccess = (res, statusCode, message, data) => {
    const response = {
        success: true,
        message,
        ...(data !== undefined && { data })
    }
    return res.status(statusCode).json(response)
}