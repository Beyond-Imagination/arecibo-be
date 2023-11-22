import fetch from 'node-fetch'

import { errors, installInfo, space } from '@/types'

export async function sync(
    organization: space.IOrganizationSecret,
    installInfo: installInfo,
) {
    await Promise.all([
        setUIExtension(organization, installInfo),
        requestRights(organization, installInfo),
    ])
}

async function setUIExtension(
    organization: space.IOrganizationSecret,
    installInfo: installInfo,
): Promise<void> {
    const url = `${organization.serverUrl}/api/http/applications/ui-extensions`
    const body = JSON.stringify(installInfo.uiExtension)
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
            Authorization: await organization.getBearerToken(),
        },
        body: body,
    })
    if (!response.ok) {
        throw new errors.ErrorSetUiExtension(await response.text())
    }
    return
}

async function requestRights(
    organization: space.IOrganizationSecret,
    installInfo: installInfo,
): Promise<void> {
    const url =
        '${organization.serverUrl}/api/http/applications/clientId:${organization.clientId}/authorizations/authorized-rights/request-rights'
    const body = JSON.stringify(installInfo.right)
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
            Authorization: await organization.getBearerToken(),
        },
        body: body,
    })
    if (!response.ok) {
        throw new errors.ErrorRequestRights(await response.text())
    }
    return
}
