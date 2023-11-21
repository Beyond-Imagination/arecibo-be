import mongoose from 'mongoose'
import { getModelForClass, prop } from '@typegoose/typegoose'

export class Message {
    public _id: mongoose.Types.ObjectId

    @prop({ required: true })
    title: string

    @prop({ required: true })
    planetId: string

    @prop({ required: true })
    content: string

    @prop({ required: true })
    author: string

    @prop({ default: 0 })
    commentCount: number

    @prop()
    likes: string[]

    @prop({ default: 0 })
    likeCount: number

    @prop({ default: false })
    isBlind: boolean

    @prop()
    createdAt: Date

    @prop()
    updatedAt: Date
}

export const MessageModel = getModelForClass(Message)
