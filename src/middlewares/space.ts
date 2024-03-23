import { NextFunction, Request, Response } from 'express'
import crypto from 'crypto'
import jwkToPem from 'jwk-to-pem'

import { OrganizationModel, AlienModel } from '@/models'
import { getPublicKeys, getUserProfile } from '@/services/space'
import { space, errors } from '@/types'

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

export async function setOrganization(req: Request, res: Response, next: NextFunction) {
    if (req.body.className === 'InitPayload') {
        req.organizationSecret = new space.OrganizationSecret(req.body.clientId, req.body.clientSecret, req.body.serverUrl)
    } else if (req.body.clientId) {
        const organization = await OrganizationModel.findByClientId(req.body.clientId)
        req.organization = organization
        req.organizationSecret = organization
    } else if (req.query.serverUrl || req.body.serverUrl) {
        const serverUrl: string = (req.query.serverUrl as string) || req.body.serverUrl
        const organization = await OrganizationModel.findByServerUrl(serverUrl)
        req.organization = organization
        req.organizationSecret = organization
    }
    next()
}

async function verifySignature(req: Request, res: Response, next: NextFunction) {
    const signature = req.headers['x-space-public-key-signature'].toString()
    const data = `${req.headers['x-space-timestamp']}:${JSON.stringify(req.body)}`

    const publicKeys = await getPublicKeys(req.organizationSecret, await req.organizationSecret.getBearerToken())
    for (const publicKey of publicKeys.keys.reverse()) {
        const key = jwkToPem(publicKey)
        const verified = crypto.verify(
            'SHA512',
            Buffer.from(data),
            {
                key: key,
                padding: crypto.constants.RSA_PKCS1_PADDING,
            },
            Buffer.from(signature, 'base64'),
        )

        if (verified) {
            return next()
        }
    }

    next(new errors.Unauthorized('fail to verify public key'))
}

export const verifySpaceRequest = [setOrganization, verifySignature]

async function verifyUser(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization')
    const secret = req.organizationSecret

    req.user = await getUserProfile(token, secret)
    req.provider = 'space'

    next()
}

export async function setAlien(req: Request, res: Response, next: NextFunction) {
    try {
        req.alien = await AlienModel.findByOauth('space', req.user.id)
        next()
    } catch (e) {
        if (e instanceof errors.AlienNotFoundException) {
            next()
        } else {
            next(e)
        }
    }
}

export const verifySpaceUserRequest = [setOrganization, verifyUser, setAlien]
