import { AppError } from "./app.error.js";
import StatusCode from "../enums/statusCode.js";

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, StatusCode.UNAUTHORIZED);
        this.name = "UnauthorizedError";
    }
}
