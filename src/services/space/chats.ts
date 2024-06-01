import { IOrganizationSecret, ChatMessage } from '@/types/space'
import { logger } from '@/utils/logger'

export async function sendMessage(organization: IOrganizationSecret, message: ChatMessage): Promise<void> {
    const response = await fetch(`${organization.serverUrl}/api/http/chats/messages/send-message`, {
        method: 'POST',
        headers: {
            Authorization: await organization.getBearerToken(),
        },
        body: JSON.stringify(message),
    })

    if (!response.ok) {
        const cause = await response.json()
        logger.error('Failed to send space message', { serverUrl: organization.serverUrl, cause: cause })
    }

    return
}

export async function sendTextMessage(organization: IOrganizationSecret, userId: string, text: string): Promise<void> {
    const message: ChatMessage = {
        channel: `member:id:${userId}`,
        content: {
            className: 'ChatMessage.Text',
            text: text,
        },
    }
    await sendMessage(organization, message)
}
