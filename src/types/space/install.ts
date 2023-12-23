export interface uiExtension {
    contextIdentifier: string
    extensions: TopLevelPageUiExtensionIn[]
}

interface TopLevelPageUiExtensionIn {
    className: string
    displayName: string
    uniqueCode: string
    iframeUrl: string
}

export interface right {
    contextIdentifier: string
    rightCodes: string[]
}
