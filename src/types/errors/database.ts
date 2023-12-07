import { APIError } from '@/types/errors/error'

export class OrganizationNotFoundException extends APIError {
    constructor() {
        super(404, 600, 'organization not found')
        Object.setPrototypeOf(this, OrganizationNotFoundException.prototype)
        Error.captureStackTrace(this, OrganizationNotFoundException)
    }
}

export class MessageNotFoundException extends APIError {
    constructor() {
        super(404, 610, 'message not found')
        Object.setPrototypeOf(this, MessageNotFoundException.prototype)
        Error.captureStackTrace(this, MessageNotFoundException)
    }
}
