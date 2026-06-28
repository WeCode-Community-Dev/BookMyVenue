import { AppError } from "./app.error.js";
import { statusCode } from "../../shared/constants/enums/statusCode.js";
export class BadRequestError extends Error {
    constructor(message = "Bad Request") {
        super(message);
        this.name = "BadRequestError";
        this.statusCode = statusCode.BAD_REQUEST;
    }
}