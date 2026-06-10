export const sendResponse = (
    res,
    {
        statusCode = 200,
        success = true,
        message = "Success",
        data = null,
        meta = null
    } = {}
) => {
    console.log("Sending response with status code:", data);
    return res.status(statusCode).json({
        success,
        message,
        data,
        meta
    });
};