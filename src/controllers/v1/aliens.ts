import express, { NextFunction, Request, Response } from 'express'
import asyncify from 'express-asyncify'

import { verifySpaceUserRequest } from '@/middlewares/space'
import { signIn, signUp } from '@/services'
import { verifyAlien } from '@/middlewares/aliens'
import { AlienModel } from '@/models/alien'

const router = asyncify(express.Router())

router.post('/login/space', verifySpaceUserRequest, async (req: Request, res: Response, next: NextFunction) => {
    if (!req.alien) {
        req.alien = await signUp(req.organization, req.provider, req.user.id)
    }
    const token = await signIn(req.provider, req.alien)
    res.status(200).json({ jwt: token, nickname: req.alien.nickname })
})

router.put('/nickname', verifyAlien, async (req: Request, res: Response) => {
    await AlienModel.updateNickname(req.alien._id, req.body.nickname)
    res.sendStatus(204)
})

export default router
