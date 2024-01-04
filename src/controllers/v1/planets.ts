import express, { Request, Response } from 'express'
import asyncify from 'express-asyncify'
import { verifyAlien } from '@/middlewares/aliens'
import { PlanetModel } from '@/models/planet'

const router = asyncify(express.Router({ mergeParams: true }))

router.get('/', verifyAlien, async (req: Request, res: Response) => {
    const planets = await PlanetModel.findByIdArray(req.alien.subscribe)
    res.status(200).json({ planets })
})

export default router
