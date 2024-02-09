import { DeleteResult } from 'mongodb'
import mongoose, { PaginateOptions } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { getModelForClass, prop, plugin, ReturnModelType } from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'

import { CommentNotFoundException } from '@/types/errors/database'
import { Alien } from './alien'

@plugin(mongoosePaginate)
class Comment extends TimeStamps {
    static paginate: mongoose.PaginateModel<typeof Comment>['paginate']

    public _id: mongoose.Types.ObjectId

    @prop({ require: true })
    public messageId: mongoose.Types.ObjectId

    @prop({ require: true })
    public planetId: mongoose.Types.ObjectId

    @prop({ require: true })
    public text: string

    @prop({ require: true, ref: Alien })
    public author: mongoose.Types.ObjectId

    @prop({ type: mongoose.Types.ObjectId })
    public likes: mongoose.Types.ObjectId[]

    @prop({ type: mongoose.Types.ObjectId, ref: Comment })
    public comments: mongoose.Types.ObjectId[]

    @prop({ ref: Comment })
    public parentCommentId: mongoose.Types.ObjectId

    @prop({ default: false })
    public isNested: boolean

    @prop({ default: false })
    public isBlind: boolean

    public get likeCount(): number {
        return this.likes.length
    }

    public toJSON(): object {
        return {
            _id: this._id,
            planetId: this.planetId,
            messageId: this.messageId,
            parentCommentId: this.parentCommentId,
            text: this.text,
            author: this.author,
            likeCount: this.likeCount,
            comments: this.comments,
            isNested: this.isNested,
            isBlind: this.isBlind,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }
    }

    public static async findByMessageId(
        this: ReturnModelType<typeof Comment>,
        messageId: string,
        page: number,
        limit: number,
    ): Promise<mongoose.PaginateResult<mongoose.PaginateDocument<typeof Comment, object, PaginateOptions>>> {
        return await this.paginate(
            { messageId: messageId, isNested: false },
            {
                sort: { createdAt: -1 },
                page: page,
                limit: limit,
                populate: [
                    {
                        path: 'author',
                        select: 'nickname organization',
                    },
                    {
                        path: 'comments',
                        populate: {
                            path: 'author',
                            select: 'nickname organization',
                        },
                    },
                ],
            },
        )
    }

    public static async findById(this: ReturnModelType<typeof Comment>, commentId: string): Promise<Comment> {
        return await this.findByFilter({ _id: commentId })
    }

    public static async deleteById(this: ReturnModelType<typeof Comment>, commentId: string): Promise<DeleteResult> {
        return this.deleteOne({ _id: commentId })
    }

    public static async deleteCommentsByMessageId(this: ReturnModelType<typeof Comment>, messageId: mongoose.Types.ObjectId): Promise<DeleteResult> {
        return this.deleteMany({ messageId: messageId })
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

const CommentModel = getModelForClass(Comment, {
    schemaOptions: {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
})

export { CommentModel }
