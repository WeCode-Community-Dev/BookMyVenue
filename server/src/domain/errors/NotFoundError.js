import { AppError } from "./app.error.js";
import StatusCode from "../enums/statusCode.js";

export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, StatusCode.NOT_FOUND);
        this.name = "NotFoundError";
    }
}
