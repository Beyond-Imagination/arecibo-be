import { APIError } from '@/types/errors/error'

export class AlienPermissionDeniedException extends APIError {
    constructor() {
        super(403, 632, 'alien permission denied')
        Object.setPrototypeOf(this, AlienPermissionDeniedException.prototype)
        Error.captureStackTrace(this, AlienPermissionDeniedException)
    }
}
