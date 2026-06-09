import { AppError } from "./app.error.js";
import StatusCode from "../enums/statusCode.js";

export class ConflictError extends AppError {
    constructor(message = "Resource already exists") {
        super(message, StatusCode.CONFLICT);
        this.name = "ConflictError";
    }
}
