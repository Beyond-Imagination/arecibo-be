import express, { Request, Response } from 'express'
import asyncify from 'express-asyncify'
import { PlanetModel } from '@/models/planet'
import { verifyAlien } from '@/middlewares/aliens'

const router = asyncify(express.Router({ mergeParams: true }))

router.get('/', verifyAlien, async (req: Request, res: Response) => {
    const planets = await PlanetModel.findSubscribablePlanetList()
    res.status(200).json({ planets: [...planets] })
})
export default router
