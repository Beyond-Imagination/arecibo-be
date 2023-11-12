import { installInfo } from '@/types'

const data: installInfo = {
    version: '0.1.0',
    uiExtension: {
        contextIdentifier: 'global',
        extension: [
            {
                className: 'ChatBotUiExtensionIn',
            },
        ],
    },
    right: {
        codes: ['Channel.PostMessages'],
    },
}

export default data
