import mongoose from 'mongoose'
import { getModelForClass, prop, ReturnModelType } from '@typegoose/typegoose'
import { CommentNotFoundException } from '@/types/errors/database'

export class Comment {
    public _id: mongoose.Types.ObjectId

    @prop({ require: true })
    public messageId: mongoose.Types.ObjectId

    @prop({ require: true })
    public text: string

    @prop({ require: true })
    public author: mongoose.Types.ObjectId

    @prop({ type: mongoose.Types.ObjectId })
    public likes: mongoose.Types.ObjectId[]

    @prop({ default: 0 })
    public likeCount: number

    @prop({ type: mongoose.Types.ObjectId, ref: Comment })
    public comments: mongoose.Types.ObjectId[]

    @prop({ default: false })
    public isNested: boolean

    @prop({ default: false })
    public isBlind: boolean

    @prop({ default: Date.now() })
    public createdAt: Date

    @prop({ default: Date.now() })
    public updatedAt: Date

    public toJSON(): object {
        return {
            _id: this._id,
            text: this.text,
            author: this.author,
            likes: this.likes,
            likeCount: this.likeCount,
            comments: this.comments,
            isBlind: this.isBlind,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }
    }

    public static async findByMessageId(this: ReturnModelType<typeof Comment>, messageId: string): Promise<Comment[]> {
        return await this.find({ messageId: messageId, isNested: false }).populate('comments').exec()
    }

    public static async findById(this: ReturnModelType<typeof Comment>, commentId: string): Promise<Comment> {
        return await this.findByFilter({ _id: commentId })
    }

    private static async findByFilter(this: ReturnModelType<typeof Comment>, filter: object): Promise<Comment> {
        const comment = await this.findOne(filter).exec()
        if (comment) {
            return comment
        } else {
            throw new CommentNotFoundException()
        }
    }
}

export const CommentModel = getModelForClass(Comment)
