import { AppError } from "./app.error.js";
import StatusCode from "../enums/statusCode.js";

export class ValidationError extends AppError {
    constructor(message = "Validation failed") {
        super(message, StatusCode.BAD_REQUEST);
        this.name = "ValidationError";
    }
}
