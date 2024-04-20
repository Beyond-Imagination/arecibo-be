import { DeleteResult } from 'mongodb'
import mongoose, { PaginateOptions } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { getModelForClass, prop, plugin, ReturnModelType } from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'

import { MessageNotFoundException } from '@/types/errors/database'
import { Planet, Alien } from '@/models'

@plugin(mongoosePaginate)
export class Message extends TimeStamps {
    static paginate: mongoose.PaginateModel<typeof Message>['paginate']

    public _id: mongoose.Types.ObjectId

    @prop({ required: true })
    title: string

    @prop({ required: true, ref: Planet })
    planetId: mongoose.Types.ObjectId

    @prop({ required: true })
    content: string

    @prop({ required: true, ref: Alien })
    author: mongoose.Types.ObjectId

    @prop({ required: true })
    authorNickname: string

    @prop({ required: true })
    authorOrganization: string

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
            planetId: this.planetId,
            title: this.title,
            content: this.content,
            author: {
                id: this.author,
                nickname: this.authorNickname,
                organization: this.authorOrganization,
            },
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
    ): Promise<mongoose.PaginateResult<mongoose.PaginateDocument<Message, object, PaginateOptions>>> {
        return await this.paginate(
            { planetId: planetId },
            {
                sort: sort,
                page: page,
                limit: limit,
            },
        )
    }

    public static async findByAuthorId(
        this: ReturnModelType<typeof Message>,
        authorId: mongoose.Types.ObjectId,
        page: number,
        limit: number,
        sort: object,
    ): Promise<mongoose.PaginateResult<mongoose.PaginateDocument<Message, object, PaginateOptions>>> {
        return await this.paginate(
            { author: authorId },
            {
                sort: sort,
                page: page,
                limit: limit,
                populate: {
                    path: 'planetId',
                    select: 'title',
                },
                select: '-author',
            },
        )
    }

    public static async findById(this: ReturnModelType<typeof Message>, messageId: string): Promise<Message> {
        return await this.findByFilter({ _id: messageId })
    }

    public static async deleteById(this: ReturnModelType<typeof Message>, messageId: mongoose.Types.ObjectId): Promise<DeleteResult> {
        return this.deleteOne({ _id: messageId })
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
