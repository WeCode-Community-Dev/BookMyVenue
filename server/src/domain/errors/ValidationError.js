import { AppError } from "./app.error.js";

export class ValidationError extends AppError {
    constructor(message = "Validation failed") {
        super(message, 400);
        this.name = "ValidationError";
    }
}
