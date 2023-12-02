import mongoose, { PaginateOptions } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { getModelForClass, prop, plugin, ReturnModelType } from '@typegoose/typegoose'

@plugin(mongoosePaginate)
export class Message {
    static paginate: mongoose.PaginateModel<typeof Message>['paginate']

    public _id: mongoose.Types.ObjectId

    @prop({ required: true })
    title: string

    @prop({ required: true })
    planetId: string

    @prop({ required: true })
    content: string

    @prop({ required: true })
    author: {
        nickname: string
        organization: string
    }

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
}

export const MessageModel = getModelForClass(Message)
