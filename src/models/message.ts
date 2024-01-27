import { DeleteResult } from 'mongodb'
import mongoose, { PaginateOptions } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { getModelForClass, prop, plugin, ReturnModelType } from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'

import { MessageNotFoundException } from '@/types/errors/database'

@plugin(mongoosePaginate)
export class Message extends TimeStamps {
    static paginate: mongoose.PaginateModel<typeof Message>['paginate']

    public _id: mongoose.Types.ObjectId

    @prop({ required: true })
    title: string

    @prop({ required: true })
    planetId: mongoose.Types.ObjectId

    @prop({ required: true })
    content: string

    @prop({ required: true })
    author: {
        nickname: string
        organization: string
    }

    @prop({ default: 0 })
    commentCount: number

    @prop({ type: mongoose.Types.ObjectId })
    public likes: mongoose.Types.ObjectId[]

    @prop({ default: false })
    isBlind: boolean

    public get likeCount(): number {
        return this.likes.length
    }

    public toJSON(): object {
        return {
            _id: this._id,
            title: this.title,
            content: this.content,
            author: this.author,
            commentCount: this.commentCount,
            likeCount: this.likeCount,
            isBlind: this.isBlind,
            createdAt: this.createdAt,
            updatedAd: this.updatedAt,
        }
    }

    public static async findByPlanetId(
        this: ReturnModelType<typeof Message>,
        planetId: string,
        page: number,
        limit: number,
        sort: object,
    ): Promise<mongoose.PaginateResult<mongoose.PaginateDocument<typeof Message, object, PaginateOptions>>> {
        return await this.paginate(
            { planetId: planetId },
            {
                sort: sort,
                page: page,
                limit: limit,
            },
        )
    }

    public static async findById(this: ReturnModelType<typeof Message>, messageId: string): Promise<Message> {
        return await this.findByFilter({ _id: messageId })
    }

    public static async deleteById(this: ReturnModelType<typeof Message>, messageId: string): Promise<DeleteResult> {
        return await this.deleteOne({ _id: messageId })
    }

    private static async findByFilter(this: ReturnModelType<typeof Message>, filter: object): Promise<Message> {
        const message = await this.findOne(filter).exec()
        if (message) {
            return message
        } else {
            throw new MessageNotFoundException()
        }
    }
}

export const MessageModel = getModelForClass(Message, {
    schemaOptions: {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
})
