import express, { Request, Response } from 'express'
import asyncify from 'express-asyncify'
import { DeleteResult } from 'mongodb'

import { MessageModel } from '@/models/message'
import { CommentModel } from '@/models/comment'
import { InvalidMessageId } from '@/types/errors/message'

const router = asyncify(express.Router({ mergeParams: true }))

router.get('/', async (req: Request, res: Response) => {
    const sort = req.query.sort == 'likes' ? { likeCount: 1 } : { createdAt: -1 }
    const page = Number(req.query.page || 1)
    const limit = Number(req.query.size || 15)

    const result = await MessageModel.findByPlanetId(req.params.planetId, page, limit, sort)
    res.status(200).json({
        messages: result.docs,
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

router.get('/:messageId', async (req: Request, res: Response) => {
    const [message, comments] = await Promise.all([MessageModel.findById(req.params.messageId), CommentModel.findByMessageId(req.params.messageId)])

    res.status(200).json({
        title: message.title,
        content: message.content,
        author: message.author.nickname,
        comments: comments,
        commentCount: message.commentCount,
        likes: message.likes,
        likeCount: message.likeCount,
        isBlind: message.isBlind,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
    })
})

router.delete('/:messageId', async (req: Request, res: Response) => {
    const deleteResult: DeleteResult = await MessageModel.deleteById(req.params.messageId)
    if (deleteResult.deletedCount === 0) {
        throw new InvalidMessageId()
    }
    res.sendStatus(204)
})

export default router
