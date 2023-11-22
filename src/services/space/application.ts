import fetch from 'node-fetch'
import { LRUCache } from 'lru-cache'

import { AccessToken, IOrganizationSecret, PublicKeys } from '@/types/space'
import { Unauthorized } from '@/types/errors'

const accessTokenCache: LRUCache<string, string> = new LRUCache<string, string>(
    {
        max: 100,
        ttl: 1000 * 60 * 9, // 9 minutes. space accessToken 이 10분간 유효하기 때문에 9분으로 설정
    },
)

export async function getAccessToken(
    secret: IOrganizationSecret,
): Promise<AccessToken> {
    const url = `${secret.serverUrl}/oauth/token`
    const token = Buffer.from(
        `${secret.clientId}:${secret.clientSecret}`,
    ).toString('base64')

    const params = new URLSearchParams()
    params.set('grant_type', 'client_credentials')
    params.set('scope', '**')

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${token}`,
        },
        body: params,
    })
    if (!response.ok) {
        throw new Unauthorized(await response.text())
    }
    return (await response.json()) as AccessToken
}

export async function getBearerToken(
    secret: IOrganizationSecret,
): Promise<string> {
    let token = accessTokenCache.get(secret.clientId)
    if (token) {
        return token
    }

    const result = await getAccessToken(secret)
    token = `Bearer ${result.access_token}`

    accessTokenCache.set(secret.clientId, token)
    return token
}

export async function getPublicKeys(
    secret: IOrganizationSecret,
    token: string,
): Promise<PublicKeys> {
    const url = `${secret.serverUrl}/api/http/applications/clientId:${secret.clientId}/public-keys`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: token,
        },
    })
    if (!response.ok) {
        throw new Unauthorized(await response.text())
    }
    return JSON.parse((await response.json()) as string) as PublicKeys
}
