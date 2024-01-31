import express, { Request, Response } from 'express'
import asyncify from 'express-asyncify'
import { DeleteResult } from 'mongodb'
import { commentLike } from '@/services/comments'

import { MessageModel } from '@/models/message'
import { CommentModel } from '@/models/comment'
import { verifyAlien } from '@/middlewares/aliens'
import { AlienPermissionDeniedException, HasNestedComment, InvalidCommentId } from '@/types/errors'

const router = asyncify(express.Router({ mergeParams: true }))

router.use(verifyAlien)

router.post('/:commentId/likes', async (req: Request, res: Response) => {
    const params = {
        commentId: req.params.commentId,
        liker: req.alien._id,
    }

    const result = await commentLike(params)

    if (result.error) {
        res.status(400).json({ message: result.error })
    } else {
        res.status(200).json({ likeCount: result.likeCount })
    }
})

router.post('/', async (req: Request, res: Response) => {
    // TODO: transaction 처리
    const message = await MessageModel.findById(req.params.messageId)
    await CommentModel.create({
        planetId: message.planetId,
        messageId: message._id,
        text: req.body.text,
        author: req.alien._id,
    })
    await MessageModel.updateOne({ _id: message._id }, { $inc: { commentCount: 1 } })

    res.sendStatus(204)
})

router.post('/:commentId', async (req: Request, res: Response) => {
    // TODO: transaction 처리
    const comment = await CommentModel.findById(req.params.commentId)
    const nestedComment = await CommentModel.create({
        planetId: comment.planetId,
        messageId: comment.messageId,
        parentCommentId: comment._id,
        text: req.body.text,
        author: req.alien._id,
        isNested: true,
    })
    await CommentModel.updateOne({ _id: comment._id }, { $push: { comments: nestedComment } })

    res.sendStatus(204)
})

router.put('/:commentId', async (req: Request, res: Response) => {
    const comment = await CommentModel.findById(req.params.commentId)
    if (req.alien._id !== comment.author) {
        throw new AlienPermissionDeniedException()
    }

    const update = {
        text: req.params.text,
        updatedAt: Date.now(),
    }
    await CommentModel.updateOne({ _id: comment._id }, update)

    res.sendStatus(204)
})

router.delete('/:commentId', async (req: Request, res: Response) => {
    const comment = await CommentModel.findById(req.params.commentId)
    if (req.alien._id !== comment.author) {
        throw new AlienPermissionDeniedException()
    }
    // TODO: nested comment를 가진 comment 처리 방식 수정
    if (comment.comments.length !== 0) {
        throw new HasNestedComment()
    }

    // TODO: transaction 처리
    if (comment.isNested) {
        await CommentModel.updateOne({ _id: comment.parentCommentId }, { $pull: { comments: comment._id } })
    } else {
        await MessageModel.updateOne({ _id: comment.messageId }, { $inc: { commentCount: -1 } })
    }
    const deleteResult: DeleteResult = await CommentModel.deleteById(req.params.commentId)
    if (deleteResult.deletedCount === 0) {
        throw new InvalidCommentId()
    }

    res.sendStatus(204)
})

export default router
