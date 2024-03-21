import express, { Request, Response } from 'express'
import asyncify from 'express-asyncify'
import { PlanetModel } from '@/models/planet'

const router = asyncify(express.Router({ mergeParams: true }))

router.get('/', async (req: Request, res: Response) => {
    const planets = await PlanetModel.findPlanetList()
    res.status(200).json({ planets: [...planets] })
})
export default router
