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

export class CommentNotFoundException extends APIError {
    constructor() {
        super(404, 620, 'comment not found')
        Object.setPrototypeOf(this, CommentNotFoundException.prototype)
        Error.captureStackTrace(this, CommentNotFoundException)
    }
}

export class AlienNotFoundException extends APIError {
    constructor() {
        super(404, 630, 'alien not found')
        Object.setPrototypeOf(this, AlienNotFoundException.prototype)
        Error.captureStackTrace(this, AlienNotFoundException)
    }
}

export class PlanetNotFoundException extends APIError {
    constructor() {
        super(404, 640, 'planet not found')
        Object.setPrototypeOf(this, PlanetNotFoundException.prototype)
        Error.captureStackTrace(this, PlanetNotFoundException)
    }
}
