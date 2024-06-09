import { APIError } from '@/types/errors/error'

export class AlienPermissionDeniedException extends APIError {
    constructor() {
        super(403, 632, 'alien permission denied')
        Object.setPrototypeOf(this, AlienPermissionDeniedException.prototype)
        Error.captureStackTrace(this, AlienPermissionDeniedException)
    }
}

export class NicknameUpdateNotAllowed extends APIError {
    constructor() {
        super(403, 633, 'nickname update is not allowed')
        Object.setPrototypeOf(this, NicknameUpdateNotAllowed.prototype)
        Error.captureStackTrace(this, NicknameUpdateNotAllowed)
    }
}

export class NicknameDuplicatedError extends APIError {
    constructor() {
        super(409, 634, 'nickname is duplicated')
        Object.setPrototypeOf(this, NicknameUpdateNotAllowed.prototype)
        Error.captureStackTrace(this, NicknameUpdateNotAllowed)
    }
}

export class JWTExpiredError extends APIError {
    constructor() {
        super(401, 635, 'token is expired')
        Object.setPrototypeOf(this, JWTExpiredError.prototype)
        Error.captureStackTrace(this, JWTExpiredError)
    }
}

export class JsonWebTokenError extends APIError {
    constructor() {
        super(401, 636, 'invalid jwt')
        Object.setPrototypeOf(this, JsonWebTokenError.prototype)
        Error.captureStackTrace(this, JsonWebTokenError)
    }
}

export class JWTNotBeforeError extends APIError {
    constructor() {
        super(401, 637, 'jwt not active')
        Object.setPrototypeOf(this, JWTNotBeforeError.prototype)
        Error.captureStackTrace(this, JWTNotBeforeError)
    }
}
