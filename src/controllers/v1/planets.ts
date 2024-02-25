import express, { Request, Response } from 'express'
import asyncify from 'express-asyncify'
import { verifyAlien } from '@/middlewares/aliens'
import { PlanetModel } from '@/models/planet'

const router = asyncify(express.Router({ mergeParams: true }))

router.get('/', verifyAlien, async (req: Request, res: Response) => {
    const [planets, defaultPlanets] = await Promise.all([
        PlanetModel.findByIdArray(req.alien.subscribe),
        PlanetModel.findDefault(), //TODO: default planet 캐싱후 db call 하지 않도록 수정
    ])
    res.status(200).json({ planets: [...planets, ...defaultPlanets] })
})

export default router
