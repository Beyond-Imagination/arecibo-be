import mongoose from 'mongoose'
import { DeleteResult } from 'mongodb'
import { getModelForClass, prop, ReturnModelType } from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'

import { AlienNotFoundException, NicknameDuplicatedError } from '@/types/errors'
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
        try {
            await this.updateOne({ _id: alienId }, { nickname: nickname, lastNicknameUpdatedTime: new Date() })
        } catch (error) {
            if (error.code === 11000) {
                throw new NicknameDuplicatedError()
            } else {
                throw error
            }
        }
    }

    public static async deleteByOrganizationId(this: ReturnModelType<typeof Alien>, organizationId: mongoose.Types.ObjectId): Promise<DeleteResult> {
        return this.deleteMany({ organizationId: organizationId })
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
