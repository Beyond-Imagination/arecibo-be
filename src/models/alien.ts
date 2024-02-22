import mongoose from 'mongoose'
import { getModelForClass, prop, ReturnModelType } from '@typegoose/typegoose'
import { AlienNotFoundException, NicknameUpdateNotAllowed } from '@/types/errors'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { Organization } from './organization'

export class Alien extends TimeStamps {
    public _id: mongoose.Types.ObjectId

    @prop({ required: true, unique: true })
    public nickname: string

    @prop()
    public oauthProvider: string

    @prop()
    public oauthId: string

    @prop({ ref: Organization })
    public organizationId: mongoose.Types.ObjectId

    @prop()
    public organization: string

    @prop()
    public subscribe: string[]

    @prop()
    public lastNicknameUpdatedTime: Date

    @prop()
    public status: number

    public static async findByOauth(this: ReturnModelType<typeof Alien>, oauthProvider: string, oauthId: string): Promise<Alien> {
        return this.findByFilter({ oauthProvider, oauthId })
    }

    public static async findById(this: ReturnModelType<typeof Alien>, alienId: mongoose.Types.ObjectId): Promise<Alien> {
        return this.findByFilter({ _id: alienId })
    }

    public static async updateNickname(this: ReturnModelType<typeof Alien>, alienId: mongoose.Types.ObjectId, nickname: string) {
        const alien = await this.findById(alienId)
        if (!alien.lastNicknameUpdatedTime || Date.now() - alien.lastNicknameUpdatedTime.getTime() >= 1000 * 60 * 60) {
            await this.updateOne({ _id: alienId }, { nickname: nickname, lastNicknameUpdatedTime: new Date() })
        } else {
            throw new NicknameUpdateNotAllowed()
        }
    }

    private static async findByFilter(this: ReturnModelType<typeof Alien>, filter: object): Promise<Alien> {
        const alien = await this.findOne(filter).exec()
        if (alien) {
            return alien
        } else {
            throw new AlienNotFoundException()
        }
    }
}

export const AlienModel = getModelForClass(Alien)
