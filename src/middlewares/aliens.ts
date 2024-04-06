import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

import { SECRET_KEY } from '@/config'
import { AlienModel } from '@/models'
import { alienJWTPayload } from '@/types'

export async function verifyAlien(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization')

    if (!token.startsWith('Bearer ')) {
        throw new Error('not bearer token')
    }

    const jsonwebtoken = token.split(' ')[1]
    const payload = verify(jsonwebtoken, SECRET_KEY) as alienJWTPayload

    req.alien = await AlienModel.findByOauth(payload.provider, payload.id)

    next()
}
