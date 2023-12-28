import express from 'express'
import asyncify from 'express-asyncify'

import { InitPayload, ChangeServerUrlPayload, ApplicationUninstalledPayload } from '@/types/space'
import { OrganizationModel } from '@/models/organization'
import { sync } from '@/services/space'
import { getInstallInfo } from '@/utils/version'
import { verifySpaceRequest } from '@/middlewares/space'
import { PlanetModel } from '@/models/planet'

const router = asyncify(express.Router())

router.use(verifySpaceRequest)

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
    await PlanetModel.create({
        title: body.serverUrl, // TODO: 실제 organization 이름 얻어서 추가
        category: 'organization',
        clientId: body.clientId,
    })
    res.sendStatus(204)
})

router.put('/changeServerUrl', async (req, res) => {
    const body = req.body as ChangeServerUrlPayload
    await OrganizationModel.updateServerUrlByClientId(body.clientId, body.newServerUrl)
    res.sendStatus(204)
})

router.delete('/uninstall', async (req, res) => {
    const body = req.body as ApplicationUninstalledPayload
    await OrganizationModel.deleteByClientId(body.clientId)
    res.sendStatus(204)
})

export default router
