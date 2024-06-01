export interface ChatMessage {
    channel: string
    content: ChatMessageText | ChatMessageBlock
}

export interface ChatMessageText {
    className: 'ChatMessage.Text'
    text: string
}

export interface ChatMessageBlock {
    className: 'ChatMessage.Block'
    style?: 'PRIMARY' | 'SECONDARY' | 'SUCCESS' | 'ERROR' | 'WARNING'
    sections: (MessageSection | MessageDivider)[]
}

export interface MessageSection {
    className: 'MessageSection'
    elements: (MessageText | MessageFields | MessageControlGroup | MessageDivider)[]
}

interface MessageText {
    className: 'MessageText'
    content: string
    accessory?: MessageIcon
}

interface MessageIcon {
    className: 'MessageIcon'
    icon: {
        icon: string
    }
}

interface MessageFields {
    className: 'MessageFields'
    fields: MessageField[]
}

interface MessageField {
    className: 'MessageField'
    first: string
    second: string
}

interface MessageControlGroup {
    className: 'MessageControlGroup'
    elements: MessageButton[]
}

interface MessageButton {
    className: 'MessageButton'
    text: string
    style: 'PRIMARY' | 'REGULAR' | 'DANGER' | 'SECONDARY'
    action: PostMessageAction
}

interface PostMessageAction {
    className: 'PostMessageAction'
    actionId: string
    payload: string
}

export interface MessageDivider {
    className: 'MessageDivider'
}
