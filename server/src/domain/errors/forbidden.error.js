import { statusCode } from "../../shared/constants/enums/statusCode.js";
import { authMessages } from "../../shared/constants/messages/authMessages.js";
import { AppError } from "./app.error.js";

export class ForbiddenError extends AppError {
    constructor(message = authMessages.error.UNAUTHORIZED) {
        super(message, statusCode.FORBIDDEN);
        this.name = "ForbiddednError";
    }
}
