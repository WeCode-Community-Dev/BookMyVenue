export class AppError extends Error {
    constructor(
        public readonly statusCode: number,
        message: string,
    ) {
        super(message);

        this.name = new.target.name;
    }
}

export class BadRequestError extends AppError {
    constructor(message = "Bad request") {
        super(400, message);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(401, message);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "Forbidden") {
        super(403, message);
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Not found") {
        super(404, message);
    }
}

export class ConflictError extends AppError {
    constructor(message = "Conflict") {
        super(409, message);
    }
}