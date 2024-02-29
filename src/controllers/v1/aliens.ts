import express, { NextFunction, Request, Response } from 'express'
import asyncify from 'express-asyncify'

import { verifySpaceUserRequest } from '@/middlewares/space'
import { signIn, signUp } from '@/services'
import { verifyAlien } from '@/middlewares/aliens'
import { AlienModel } from '@/models/alien'
import { NicknameUpdateNotAllowed } from '@/types/errors'

const router = asyncify(express.Router())

router.post('/login/space', verifySpaceUserRequest, async (req: Request, res: Response, next: NextFunction) => {
    if (!req.alien) {
        req.alien = await signUp(req.organization, req.provider, req.user.id)
    }
    const token = await signIn(req.provider, req.alien)
    res.status(200).json({ jwt: token, nickname: req.alien.nickname })
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

export default router
