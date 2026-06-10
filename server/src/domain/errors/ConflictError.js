import { AppError } from "./app.error.js";
import { statusCode } from "../../shared/constants/enums/statusCode.js";

export class ConflictError extends AppError {
    constructor(message = "Resource already exists") {
        super(message, statusCode.CONFLICT);
        this.name = "ConflictError";
    }
}
