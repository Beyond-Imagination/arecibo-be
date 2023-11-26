import { APIError } from '@/types/errors/error'

export class OrganizationNotFoundException extends APIError {
    constructor() {
        super(404, 600, 'organization not found')
        Object.setPrototypeOf(this, OrganizationNotFoundException.prototype)
        Error.captureStackTrace(this, OrganizationNotFoundException)
    }
}
