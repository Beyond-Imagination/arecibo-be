import mongoose from 'mongoose'
import { getModelForClass, prop } from '@typegoose/typegoose'

export class Comment {
    public _id: mongoose.Types.ObjectId

    @prop({ require: true, unique: true })
    public messageId: mongoose.Types.ObjectId

    @prop({ require: true })
    public text: string

    @prop({ require: true })
    public author: mongoose.Types.ObjectId

    @prop({ type: mongoose.Types.ObjectId })
    public likes: mongoose.Types.ObjectId[]

    @prop({ default: 0 })
    public likeCount: number

    @prop({ type: mongoose.Types.ObjectId })
    public comments: mongoose.Types.ObjectId[]

    @prop({ default: false })
    public isBlind: boolean

    @prop()
    public createdAt: Date

    @prop()
    public updatedAt: Date
}

export const CommentModel = getModelForClass(Comment)
