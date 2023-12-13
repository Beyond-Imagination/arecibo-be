import express, { NextFunction, Request, Response } from 'express'
import asyncify from 'express-asyncify'

import { verifySpaceUserRequest } from '@/middlewares/space'
import { signIn, signUp } from '@/services'

// todo: import AlienModel

const router = asyncify(express.Router())

router.post('/login/space', verifySpaceUserRequest, async (req: Request, res: Response, next: NextFunction) => {
    if (!req.alien) {
        req.alien = await signUp(req.provider, req.user.id)
    }
    const token = await signIn(req.provider, req.alien)
    res.status(200).json({ jwt: token, nickname: req.alien.nickname })
})

router.put('/:id/nickname', async (req, res) => {
    // todo: get req data
    // todo: exec function updateNickname
    res.status(204).send()
})

export default router
