import { APIError } from '@/types/errors/error'

export class InvalidVersion extends APIError {
    constructor() {
        super(401, 490, 'invalid version')
        Object.setPrototypeOf(this, InvalidVersion.prototype)
        Error.captureStackTrace(this, InvalidVersion)
    }
}

export class Unauthorized extends APIError {
    constructor(cause: Error | string = null) {
        super(401, 401, 'unauthorized', cause)
        Object.setPrototypeOf(this, Unauthorized.prototype)
        Error.captureStackTrace(this, Unauthorized)
    }
}
