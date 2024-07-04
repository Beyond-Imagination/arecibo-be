import { APIError } from '@/types/errors/error'

export class InvalidFilename extends APIError {
    constructor() {
        super(400, 650, 'invalid filename')
        Object.setPrototypeOf(this, InvalidFilename.prototype)
        Error.captureStackTrace(this, InvalidFilename)
    }
}
