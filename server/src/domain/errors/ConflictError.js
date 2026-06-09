import { AppError } from "./app.error.js";

export class ConflictError extends AppError {
    constructor(message = "Resource already exists") {
        super(message, 409);
        this.name = "ConflictError";
    }
}
