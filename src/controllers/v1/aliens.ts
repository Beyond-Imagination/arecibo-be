import express, { NextFunction, Request, Response } from 'express'
import asyncify from 'express-asyncify'

import { verifySpaceUserRequest } from '@/middlewares/space'
import { signIn, signUp } from '@/services'
import { verifyAlien } from '@/middlewares/aliens'
import { AlienModel, PlanetModel } from '@/models'
import { NicknameUpdateNotAllowed } from '@/types/errors'

const router = asyncify(express.Router())

router.post('/login/space', verifySpaceUserRequest, async (req: Request, res: Response, next: NextFunction) => {
    if (!req.alien) {
        req.alien = await signUp(req.organization, req.provider, req.user.id)
    }
    const token = await signIn(req.provider, req.alien)
    res.status(200).json({ jwt: token })
})

router.get('/detail', verifyAlien, async (req: Request, res: Response) => {
    res.status(200).json({
        nickname: req.alien.nickname,
        lastNicknameUpdateTime: req.alien.lastNicknameUpdatedTime,
    })
})

router.put('/nickname', verifyAlien, async (req: Request, res: Response) => {
    if (!req.alien.lastNicknameUpdatedTime || Date.now() - req.alien.lastNicknameUpdatedTime.getTime() >= 1000 * 60 * 60) {
        await AlienModel.updateNickname(req.alien._id, req.body.nickname)
    } else {
        throw new NicknameUpdateNotAllowed()
    }
    res.sendStatus(204)
})

router.get('/planets/subscribe', verifyAlien, async (req: Request, res: Response) => {
    const [planets, defaultPlanets] = await Promise.all([
        PlanetModel.findByIdArray(req.alien.subscribe),
        PlanetModel.findDefault(), //TODO: default planet 캐싱후 db call 하지 않도록 수정
    ])
    res.status(200).json({ planets: [...planets, ...defaultPlanets] })
})

router.post('/planets/:planetId/subscribe', verifyAlien, async (req: Request, res: Response) => {
    // TODO subscribe 되면 안되는 planet 확인 ex) 다른 organization 의 planet, default planet
    await AlienModel.updateOne({ _id: req.alien._id }, { $addToSet: { subscribe: req.params.planetId } })
    res.sendStatus(204)
})

router.delete('/planets/:planetId/subscribe', verifyAlien, async (req: Request, res: Response) => {
    // TODO unsubscribe 되면 안되는 planet 확인 ex) 본인의 organization planet
    await AlienModel.updateOne({ _id: req.alien._id }, { $pull: { subscribe: req.params.planetId } })
    res.sendStatus(204)
})

export default router
