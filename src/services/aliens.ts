import jwt from 'jsonwebtoken'
import { v4 } from 'uuid'

import { Alien, AlienModel } from '@/models/alien'

export async function signUp(provider: string, oauthId: string): Promise<Alien> {
    // TODO nickname unique 처리 필요
    return await AlienModel.create({
        oauthProvider: provider,
        oauthId: oauthId,
        nickname: Math.random().toString(36).substring(2, 10),
    })
}

export async function signIn(provider: string, alien: Alien): Promise<string> {
    // TODO last login 시간 저장
    // TODO secret env 에서 받도록 수정
    return jwt.sign({ id: alien._id, provider: provider }, 'secret-수정필요', {
        expiresIn: '1h',
        jwtid: v4(),
    })
}
