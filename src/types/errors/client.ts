import { APIError } from '@/types/errors/error'

export class InvalidVersion extends APIError {
    constructor() {
        super(401, 490, 'invalid version')
        Object.setPrototypeOf(this, InvalidVersion.prototype)
        Error.captureStackTrace(this, InvalidVersion)
    }
}
