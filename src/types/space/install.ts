export interface uiExtension {
    contextIdentifier: string
    extension: TopLevelPageUiExtensionIn[]
}

interface TopLevelPageUiExtensionIn {
    className: string
    displayName: string
    uniqueCode: string
    iframeUrl: string
}

export interface right {
    codes: string[]
}
