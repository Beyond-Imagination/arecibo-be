import { APIError } from '@/types/errors/error'

export class ErrorGetSpaceOrganization extends APIError {
    constructor(cause: Error | string = null) {
        super(500, 700, 'error getting space organization', cause)
        Object.setPrototypeOf(this, ErrorGetSpaceOrganization.prototype)
        Error.captureStackTrace(this, ErrorGetSpaceOrganization)
    }
}

export class ErrorSetUiExtension extends APIError {
    constructor(cause: Error | string = null) {
        super(500, 710, 'error set ui extension', cause)
        Object.setPrototypeOf(this, ErrorSetUiExtension.prototype)
        Error.captureStackTrace(this, ErrorSetUiExtension)
    }
}

export class ErrorRequestRights extends APIError {
    constructor(cause: Error | string = null) {
        super(500, 711, 'error request rights', cause)
        Object.setPrototypeOf(this, ErrorRequestRights.prototype)
        Error.captureStackTrace(this, ErrorRequestRights)
    }
}

export class InvalidClassName extends APIError {
    constructor() {
        super(401, 790, 'invalid class name')
        Object.setPrototypeOf(this, InvalidClassName.prototype)
        Error.captureStackTrace(this, InvalidClassName)
    }
}
