export class AppError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
        this.name = 'AppError'

        Object.setPrototypeOf(this, AppError.prototype)
    }

}