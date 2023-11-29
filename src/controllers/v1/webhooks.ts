import express from 'express'
import asyncify from 'express-asyncify'

import { ChangeServerUrlPayload, InitPayload } from '@/types/space'
import { OrganizationModel } from '@/models/organization'
import { sync } from '@/services/space'
import { getInstallInfo } from '@/utils/version'

const router = asyncify(express.Router())

router.post('/install', async (req, res) => {
    const body = req.body as InitPayload
    const installInfo = getInstallInfo()
    await sync(req.organizationSecret, installInfo)
    await OrganizationModel.create({
        clientId: body.clientId,
        clientSecret: body.clientSecret,
        serverUrl: body.serverUrl,
        admin: [body.userId],
        version: installInfo.version,
    })
    res.sendStatus(204)
})

router.put('/changeServerUrl', async (req, res) => {
    const body = req.body as ChangeServerUrlPayload
    await OrganizationModel.updateServerUrlByClientId(body.clientId, body.newServerUrl)
    res.sendStatus(204)
})

export default router
