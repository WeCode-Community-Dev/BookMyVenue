import { AppError } from "./app.error.js";
import { statusCode } from "../../shared/constants/enums/statusCode.js";

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, statusCode.UNAUTHORIZED);
        this.name = "UnauthorizedError";
    }
}
