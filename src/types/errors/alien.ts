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
        Object.setPrototypeOf(this, NicknameUpdateNotAllowed)
        Error.captureStackTrace(this, NicknameUpdateNotAllowed)
    }
}
