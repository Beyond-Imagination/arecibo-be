import mongoose from 'mongoose'
import { getModelForClass, prop, ReturnModelType } from '@typegoose/typegoose'
import { AlienNotFoundException } from '@/types/errors/database'

export class Alien {
    public _id: mongoose.Types.ObjectId

    @prop({ required: true, unique: true })
    public nickname: string

    @prop()
    public oauthProvider: string

    @prop()
    public oauthId: string

    @prop()
    public subscribe: string[]

    @prop()
    public createdAt: Date

    @prop()
    public updatedAt: Date

    @prop()
    public lasetNicknameUpdatedTime: Date

    @prop()
    public status: number

    public static async findBytId(this: ReturnModelType<typeof Alien>, oauthProvider: string, oauthId: string): Promise<Alien> {
        return this.findByFilter({ oauthProvider, oauthId })
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
