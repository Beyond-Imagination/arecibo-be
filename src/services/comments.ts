import { CommentModel } from '@/models'
import { CommentNotFoundException } from '@/types/errors'

export async function commentLike({ commentId, liker }): Promise<{ likeCount?: number; error?: string }> {
    try {
        const comment = await CommentModel.findById({ _id: commentId })

        if (!comment) {
            throw new CommentNotFoundException()
        }

        const alreadyLiked = comment.likes.includes(liker)

        // TODO : api 동시 요청 처리
        const update = alreadyLiked ? { $pull: { likes: liker } } : { $push: { likes: liker } }

        const updatedComment = await CommentModel.findOneAndUpdate({ _id: comment._id }, update, {
            new: true,
        }).exec()

        if (!updatedComment) {
            throw new Error('Error updating comment')
        }

        return { likeCount: updatedComment.likeCount }
    } catch (error) {
        throw new Error('Error updating likes')
    }
}
