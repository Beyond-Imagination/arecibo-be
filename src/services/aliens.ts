import jwt from 'jsonwebtoken'
import { v4 } from 'uuid'

import { Alien, AlienModel } from '@/models/alien'
import { PlanetModel } from '@/models/planet'
import { Organization } from '@/models/organization'

export async function signUp(organization: Organization, provider: string, oauthId: string): Promise<Alien> {
    const planet = await PlanetModel.findByClientId(organization.clientId)
    // TODO nickname unique 처리 필요
    return await AlienModel.create({
        oauthProvider: provider,
        oauthId: oauthId,
        subscribe: [planet._id],
        nickname: Math.random().toString(36).substring(2, 10),
        organization: planet.title,
        organizationId: organization._id,
    })
}

export async function signIn(provider: string, alien: Alien): Promise<string> {
    // TODO last login 시간 저장
    // TODO secret env 에서 받도록 수정
    return jwt.sign({ id: alien.oauthId, provider: provider }, 'secret-수정필요', {
        expiresIn: '1h',
        jwtid: v4(),
    })
}
