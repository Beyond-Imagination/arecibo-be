import jwt from 'jsonwebtoken'
import { v4 } from 'uuid'

import { SECRET_KEY } from '@/config'
import { Alien, AlienModel, PlanetModel, Organization, OrganizationModel, CommentModel, MessageModel, Comment, Message } from '@/models'
import {
    getNotificationWhenCommentOnMessage,
    getNotificationWhenLikeOnComment,
    getNotificationWhenLikeOnMessage,
    getNotificationWhenReplyToComment,
} from './notification'
import { sendTextMessage } from '@/services/space'

export async function signUp(organization: Organization, provider: string, oauthId: string): Promise<Alien> {
    const planet = await PlanetModel.findByClientId(organization.clientId)
    // TODO nickname unique 처리 필요
    return await AlienModel.create({
        oauthProvider: provider,
        oauthId: oauthId,
        subscribe: [planet._id],
        nickname: Math.random().toString(36).substring(2, 10),
        organization: planet.title,
        organizationId: organization._id,
    })
}

export async function signIn(provider: string, alien: Alien): Promise<string> {
    // TODO last login 시간 저장
    return jwt.sign({ id: alien.oauthId, provider: provider }, SECRET_KEY, {
        expiresIn: '1h',
        jwtid: v4(),
    })
}

export async function notifyWhenLikeOnMessage({ messageId }): Promise<void> {
    const message = await MessageModel.findById(messageId)
    const messageAuthor = await AlienModel.findById(message.author)
    const organization = await OrganizationModel.findById(messageAuthor.organizationId)

    const notificationContent = await getNotificationWhenLikeOnMessage(message.title)

    return await sendTextMessage(organization, messageAuthor.oauthId, notificationContent)
}

export async function notifyWhenLikeOnComment({ commentId }): Promise<void> {
    const comment = await CommentModel.findById(commentId)
    const commentAuthor = await AlienModel.findById(comment.author)
    const organization = await OrganizationModel.findById(commentAuthor.organizationId)

    const notificationContent = await getNotificationWhenLikeOnComment(comment.text)

    return await sendTextMessage(organization, commentAuthor.oauthId, notificationContent)
}

export async function notifyWhenCommentOnMessage(message: Message, comment: Comment): Promise<void> {
    const messageAuthor = await AlienModel.findById(message.author)
    const organization = await OrganizationModel.findById(messageAuthor.organizationId)

    const notificationContent = await getNotificationWhenCommentOnMessage(comment.text)

    return await sendTextMessage(organization, messageAuthor.oauthId, notificationContent)
}

export async function notifyWhenReplyToComment(comment: Comment, nestedComment: Comment): Promise<void> {
    const commentAuthor = await AlienModel.findById(comment.author)
    const organization = await OrganizationModel.findById(commentAuthor.organizationId)

    const notificationContent = await getNotificationWhenReplyToComment(nestedComment.text)

    return await sendTextMessage(organization, commentAuthor.oauthId, notificationContent)
}
