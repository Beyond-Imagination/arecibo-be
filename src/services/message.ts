import { MessageModel } from '@/models'
import { MessageNotFoundException } from '@/types/errors'

export async function messageLike({ messageId, likerId }): Promise<{ likeCount?: number; error?: string }> {
    try {
        const message = await MessageModel.findById(messageId)

        if (!message) {
            throw new MessageNotFoundException()
        }

        const alreadyLiked = message.likes.includes(likerId)

        // TODO : api 동시 요청 처리
        const update = alreadyLiked ? { $pull: { likes: likerId } } : { $push: { likes: likerId } }

        const updatedMessage = await MessageModel.findOneAndUpdate({ _id: message._id }, update, {
            new: true,
        }).exec()

        if (!updatedMessage) {
            throw new Error('Error updating message')
        }

        return { likeCount: updatedMessage.likeCount }
    } catch (error) {
        throw new Error('Error updating likes')
    }
}
