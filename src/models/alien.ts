import mongoose from 'mongoose'
import { getModelForClass, prop, ReturnModelType } from '@typegoose/typegoose'
import { AlienNotFoundException } from '@/types/errors/database'
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
    public lasetNicknameUpdatedTime: Date

    @prop()
    public status: number

    public static async findByOauth(this: ReturnModelType<typeof Alien>, oauthProvider: string, oauthId: string): Promise<Alien> {
        return this.findByFilter({ oauthProvider, oauthId })
    }

    public static async findById(this: ReturnModelType<typeof Alien>, alienId: mongoose.Types.ObjectId): Promise<Alien> {
        return this.findByFilter({ _id: alienId })
    }

    private static async findByFilter(this: ReturnModelType<typeof Alien>, filter: object): Promise<Alien> {
        const alien = await this.findOne(filter).exec()
        if (alien) {
            return alien
        } else {
            throw new AlienNotFoundException()
        }
    }

    // todo: add function updateNickname
}

export const AlienModel = getModelForClass(Alien)
