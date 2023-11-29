import { getBearerToken } from '@/services/space'
import { IOrganizationSecret } from '@/types/space/api'

export interface InitPayload {
    className: string
    clientId: string
    clientSecret: string
    serverUrl: string
    state: string
    userId: string
}

export interface ChangeServerUrlPayload {
    className: string
    clientId: string
    newServerUrl: string
}

export interface ApplicationUninstalledPayload {
    className: string
    clientId: string
    serverUrl: string
}

export class OrganizationSecret implements IOrganizationSecret {
    clientId: string
    clientSecret: string
    serverUrl: string

    constructor(clientId: string, clientSecret: string, serverUrl: string) {
        this.clientId = clientId
        this.clientSecret = clientSecret
        this.serverUrl = serverUrl
    }

    public async getBearerToken(): Promise<string> {
        return getBearerToken(this)
    }
}
