import mongoose from 'mongoose'
import { DeleteResult } from 'mongodb'
import { getModelForClass, index, prop, ReturnModelType } from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'

import { PlanetNotFoundException } from '@/types/errors'

@index({ clientId: 1 })
@index({ default: 1 })
export class Planet extends TimeStamps {
    public _id: mongoose.Types.ObjectId

    @prop({ required: true, unique: true })
    public title: string

    @prop({ required: true })
    public category: string

    @prop()
    public clientId: string

    @prop({ default: false })
    public default: boolean

    @prop()
    public description: string

    public toJSON(): object {
        return {
            _id: this._id,
            title: this.title,
            category: this.category,
            default: this.default,
            description: this.description,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }
    }

    public static async findByClientId(this: ReturnModelType<typeof Planet>, clientId: string): Promise<Planet> {
        return this.findByFilter({ clientId: clientId })
    }

    private static async findByFilter(this: ReturnModelType<typeof Planet>, filter: object): Promise<Planet> {
        const planet = await this.findOne(filter).exec()
        if (planet) {
            return planet
        } else {
            throw new PlanetNotFoundException()
        }
    }

    // TODO: 캐싱하기
    public static async findDefault(this: ReturnModelType<typeof Planet>): Promise<Planet[]> {
        return this.find({ default: true })
    }

    public static async findByIdArray(this: ReturnModelType<typeof Planet>, ids: mongoose.Types.ObjectId[]): Promise<Planet[]> {
        return this.find({ _id: { $in: ids } })
    }

    public static async deleteByClientId(this: ReturnModelType<typeof Planet>, clientId: string): Promise<DeleteResult> {
        return this.deleteOne({ clientId: clientId })
    }

    public static async findSubscribablePlanetList(this: ReturnModelType<typeof Planet>): Promise<Planet[]> {
        return this.find({ clientId: undefined, default: false })
    }
}

export const PlanetModel = getModelForClass(Planet)
