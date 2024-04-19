import fetch from 'node-fetch'

import { IOrganizationSecret, Profile, Team } from '@/types/space'
import { Unauthorized } from '@/types/errors'

export async function getUserProfile(token: string, secret: IOrganizationSecret): Promise<Profile> {
    const url = `${secret.serverUrl}/api/http/team-directory/profiles/me`

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: token,
        },
    })

    if (!response.ok) {
        throw new Unauthorized(await response.text())
    }

    return (await response.json()) as Profile
}

export async function GetTeam(token: string, secret: IOrganizationSecret): Promise<Team> {
    const url = `${secret.serverUrl}/api/http/team-directory/teams/name:Beyond_Imagination?$fields=id,name,memberships(member(id,username))`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
        body: null,
    })

    if (!response.ok) {
        throw new Unauthorized(await response.text())
    }

    return await response.json()
}
