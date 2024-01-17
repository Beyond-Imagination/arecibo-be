import { MessageModel } from '@/models/message'
import mongoose from 'mongoose'

export async function messageLike({ messageId, planetId, liker }): Promise<{ likeCount?: number; error?: string }> {
    try {
        const message = await MessageModel.findById(new mongoose.Types.ObjectId(messageId)).lean()

        if (!message) {
            return { error: 'Message not found' }
        }

        const alreadyLiked = message.likes.includes(liker)

        const update = alreadyLiked ? { $inc: { likeCount: -1 }, $pull: { likes: liker } } : { $inc: { likeCount: 1 }, $push: { likes: liker } }

        const updatedMessage = await MessageModel.findOneAndUpdate({ _id: message._id, planetId: new mongoose.Types.ObjectId(planetId) }, update, {
            new: true,
            lean: true,
        }).exec()

        if (!updatedMessage) {
            return { error: 'Error updating message' }
        }

        return { likeCount: updatedMessage.likeCount }
    } catch (error) {
        return { error: 'Error updating likes' }
    }
}
