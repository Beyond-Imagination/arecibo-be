export interface uiExtension {
    contextIdentifier: string
    extension: {
        className: string
        displayName?: string
        uniqueCode?: string
        iframeURL?: string
    }[]
}

export interface right {
    codes: string[]
}
