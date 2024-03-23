import { NextFunction, Request, Response } from 'express'

import { AlienPermissionDeniedException } from '@/types/errors'
import { MessageModel } from '@/models'

export async function verifyMessageAuthor(req: Request, res: Response, next: NextFunction) {
    req.message = await MessageModel.findById(req.params.messageId)
    if (!req.alien._id.equals(req.message.author)) {
        throw new AlienPermissionDeniedException()
    }

    next()
}
