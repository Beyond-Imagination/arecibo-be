import { NextFunction, Request, Response } from 'express'
import { AlienPermissionDeniedException } from '@/types/errors'
import { CommentModel } from '@/models/comment'

export async function verifyCommentAuthor(req: Request, res: Response, next: NextFunction) {
    req.comment = await CommentModel.findById(req.params.commentId)
    if (!req.alien._id.equals(req.comment.author)) {
        throw new AlienPermissionDeniedException()
    }

    next()
}
