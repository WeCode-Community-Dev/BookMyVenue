import { AppError } from "./app.error.js";
import { statusCode } from "../../shared/constants/enums/statusCode.js";

export class ValidationError extends AppError {
    constructor(message = "Validation failed") {
        super(message, statusCode.BAD_REQUEST);
        this.name = "ValidationError";
    }
}
