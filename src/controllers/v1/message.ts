import express, { Request, Response } from 'express'
import asyncify from 'express-asyncify'

import { MessageModel } from '@/models/message'

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

export default router
