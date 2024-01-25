import express, { Request, Response } from 'express'
import asyncify from 'express-asyncify'

import { MessageModel } from '@/models/message'
import { CommentModel } from '@/models/comment'
import { verifyAlien } from '@/middlewares/aliens'

const router = asyncify(express.Router({ mergeParams: true }))

router.use(verifyAlien)

router.post('/', async (req: Request, res: Response) => {
    // TODO: transaction 처리
    const message = await MessageModel.findById(req.params.messageId)
    await CommentModel.create({
        messageId: message._id,
        text: req.body.text,
        author: req.params._id,
    })
    await MessageModel.updateOne({ _id: message._id }, { $inc: { commentCount: 1 } })

    res.sendStatus(204)
})

export default router
