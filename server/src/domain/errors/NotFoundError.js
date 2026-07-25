import { AppError } from "./app.error.js";
import { statusCode } from "../../shared/constants/enums/statusCode.js";

export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, statusCode.NOT_FOUND);
        this.name = "NotFoundError";
    }
}
