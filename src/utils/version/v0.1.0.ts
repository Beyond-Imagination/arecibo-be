import { installInfo } from '@/types'
import { CLIENT_URL } from '@/config'

const data: installInfo = {
    version: '0.1.0',
    uiExtension: {
        contextIdentifier: 'global',
        extension: [
            {
                className: 'TopLevelPageUiExtensionIn',
                displayName: 'Arecibo',
                uniqueCode: 'Arecibo',
                iframeUrl: CLIENT_URL,
            },
        ],
    },
    right: {
        codes: ['Profile.View'],
    },
}

export default data
