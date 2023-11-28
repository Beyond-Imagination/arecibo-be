import { NextFunction, Request, Response } from 'express'

export const classNameRouter = (req: Request, res: Response, next: NextFunction) => {
    switch (req.body.className) {
        case 'InitPayload': // init install by marketplace
            req.url = '/v1/webhooks/install'
            req.method = 'POST'
            break
        case 'ChangeServerUrlPayload': // organization change server
            req.url = '/v1/webhooks/changeServerUrl'
            req.method = 'PUT'
            break
        case 'ApplicationUninstalledPayload': // uninstall
            req.url = '/v1/webhooks/uninstall'
            req.method = 'DELETE'
            break
        case 'AppPublicationCheckPayload': // markplace check app
            res.sendStatus(200)
            return
    }
    res.meta.path = req.url
    res.meta.method = req.method
    next()
}
