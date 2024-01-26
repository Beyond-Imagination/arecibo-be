import { APIError } from '@/types/errors/error'

export class InvalidCommentId extends APIError {
    constructor() {
        super(400, 621, 'invalid comment id')
        Object.setPrototypeOf(this, InvalidCommentId.prototype)
        Error.captureStackTrace(this, InvalidCommentId)
    }
}

export class HasNestedComment extends APIError {
    constructor() {
        super(400, 622, 'comment has nested comments')
        Object.setPrototypeOf(this, InvalidCommentId.prototype)
        Error.captureStackTrace(this, InvalidCommentId)
    }
}
