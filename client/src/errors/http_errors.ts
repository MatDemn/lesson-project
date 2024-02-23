export class HttpAPIError extends Error {
    status: number;

    constructor(status: number, message?: string) {
        super(message);
        this.status = status;
        this.name = this.constructor.name;
    }
}

/**
 * Status code: 401 
 */ 
export class UnauthorizedError extends HttpAPIError {}

/**
 * Status code: 403 
 */ 
export class ForbiddenError extends HttpAPIError {}

/**
 * Status code: 404 
 */ 
export class NotFoundError extends HttpAPIError {}

/**
 * Status code: 409
 */
export class ConflictError extends HttpAPIError {}

/**
 * Status code: 500
 */
export class ServerError extends HttpAPIError {}

/**
 * Status code: 501
 */
export class NotImplementedError extends HttpAPIError {}

/**
 * Status code: 503
 */
export class ServiceUnavailableError extends HttpAPIError {}

// Add more error classes if you need distinction