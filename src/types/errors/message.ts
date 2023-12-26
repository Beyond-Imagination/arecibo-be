import { APIError } from '@/types/errors/error'

export class InvalidMessageId extends APIError {
    constructor() {
        super(400, 611, 'invalid message id')
        Object.setPrototypeOf(this, InvalidMessageId.prototype)
        Error.captureStackTrace(this, InvalidMessageId)
    }
}
