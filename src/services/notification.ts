export async function getNotificationWhenLikeOnMessage(messageTitle: string) {
    return `Someone liked your message.
    - ${messageTitle}`
}

export async function getNotificationWhenLikeOnComment(commentContent: string) {
    return `Someone liked your comment.
    - ${commentContent}`
}

export async function getNotificationWhenCommentOnMessage(commentContent: string) {
    return `Someone commented on your message. 
    - ${commentContent}`
}

export async function getNotificationWhenReplyToComment(nestedComment: string) {
    return `Someone replied to your comment with the reply.
    - ${nestedComment}`
}
