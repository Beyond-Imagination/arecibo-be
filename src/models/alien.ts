import mongoose from 'mongoose'
import { getModelForClass, prop } from '@typegoose/typegoose'

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
}

export const AlienModel = getModelForClass(Alien)
