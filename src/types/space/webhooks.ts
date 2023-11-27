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
