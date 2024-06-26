import express, { Request, Response } from 'express'
import asyncify from 'express-asyncify'
import { DeleteResult } from 'mongodb'

import { MessageModel, CommentModel } from '@/models'
import { InvalidMessageId } from '@/types/errors/message'
import { messageLike } from '@/services/message'
import { verifyAlien } from '@/middlewares/aliens'
import { verifyMessageAuthor } from '@/middlewares/message'
import { notifyWhenLikeOnMessage } from '@/services/aliens'

const router = asyncify(express.Router({ mergeParams: true }))

router.use(verifyAlien)

router.get('/', async (req: Request, res: Response) => {
    const sort = req.query.sort === 'likes' ? { likeCount: 1 } : { createdAt: -1 }
    const page = Number(req.query.page || 1)
    const limit = Number(req.query.size || 15)

    const result = await MessageModel.findByPlanetId(req.params.planetId, page, limit, sort)

    const messages = result.docs.map((message) => ({
        ...message.toJSON(),
        isLiked: message.likes.includes(req.alien._id),
        isAuthor: message.author.equals(req.alien._id),
    }))

    res.status(200).json({
        messages: messages,
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
    await MessageModel.create({
        planetId: req.params.planetId,
        title: req.body.title,
        content: req.body.content,
        author: req.alien._id,
        authorNickname: req.alien.nickname,
        authorOrganization: req.alien.organization,
    })
    res.sendStatus(204)
})

router.put('/:messageId', verifyMessageAuthor, async (req: Request, res: Response) => {
    await MessageModel.updateOne({ _id: req.message._id }, { title: req.body.title, content: req.body.content })

    res.sendStatus(204)
})

router.get('/:messageId', async (req: Request, res: Response) => {
    const message = await MessageModel.findById(req.params.messageId)

    res.status(200).json({
        _id: message._id,
        title: message.title,
        content: message.content,
        author: {
            nickname: message.authorNickname,
            organization: message.authorOrganization,
        },
        commentCount: message.commentCount,
        isLiked: message.likes.includes(req.alien._id),
        likeCount: message.likeCount,
        isAuthor: req.alien._id.equals(message.author),
        isBlind: message.isBlind,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
    })
})

router.post('/:messageId/likes', async (req: Request, res: Response) => {
    const params = {
        messageId: req.params.messageId,
        likerId: req.alien._id,
    }

    const result = await messageLike(params)

    if (result.error) {
        res.status(400).json({ message: result.error })
    } else {
        await notifyWhenLikeOnMessage(params)
        res.status(200).json({ likeCount: result.likeCount })
    }
})

router.delete('/:messageId', verifyMessageAuthor, async (req: Request, res: Response) => {
    if (req.message.commentCount) {
        await CommentModel.deleteCommentsByMessageId(req.message._id)
    }

    const deleteResult: DeleteResult = await MessageModel.deleteById(req.message._id)
    if (deleteResult.deletedCount === 0) {
        throw new InvalidMessageId()
    }
    res.sendStatus(204)
})

export default router
