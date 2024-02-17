import express, { Request, Response } from 'express'
import asyncify from 'express-asyncify'
import { DeleteResult } from 'mongodb'
import { commentLike } from '@/services/comments'

import { MessageModel } from '@/models/message'
import { CommentModel } from '@/models/comment'
import { verifyAlien } from '@/middlewares/aliens'
import { HasNestedComment, InvalidCommentId } from '@/types/errors'
import { verifyCommentAuthor } from '@/middlewares/comment'

const router = asyncify(express.Router({ mergeParams: true }))

router.use(verifyAlien)

router.get('/', async (req: Request, res: Response) => {
    const page = Number(req.query.page || 1)
    const limit = Number(req.query.size || 10)

    const result = await CommentModel.findByMessageId(req.params.messageId, page, limit)

    const addFieldsToComments = (comments) => {
        return comments.map((comment) => {
            const isLiked = comment.likes.includes(req.alien._id)
            const isAuthor = comment.author._id.equals(req.alien._id)
            const nestedComments = addFieldsToComments(comment.comments)
            return {
                ...comment.toJSON(),
                isLiked: isLiked,
                isAuthor: isAuthor,
                comments: nestedComments,
            }
        })
    }
    const comments = await addFieldsToComments(result.docs)

    res.status(200).json({
        comments: comments,
        page: {
            totalDocs: result.totalDocs,
            totalPages: result.totalPages,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage,
            page: result.page,
            limit: result.limit,
        },
    })
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

router.put('/:commentId', verifyCommentAuthor, async (req: Request, res: Response) => {
    const update = {
        text: req.body.text,
    }
    await CommentModel.updateOne({ _id: req.params.commentId }, update)

    res.sendStatus(204)
})

router.delete('/:commentId', verifyCommentAuthor, async (req: Request, res: Response) => {
    // TODO: nested comment를 가진 comment 처리 방식 수정
    if (req.comment.comments.length !== 0) {
        throw new HasNestedComment()
    }

    // TODO: transaction 처리
    if (req.comment.isNested) {
        await CommentModel.updateOne({ _id: req.comment.parentCommentId }, { $pull: { comments: req.comment._id } })
    } else {
        await MessageModel.updateOne({ _id: req.comment.messageId }, { $inc: { commentCount: -1 } })
    }
    const deleteResult: DeleteResult = await CommentModel.deleteById(req.params.commentId)
    if (deleteResult.deletedCount === 0) {
        throw new InvalidCommentId()
    }

    res.sendStatus(204)
})

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

export default router
