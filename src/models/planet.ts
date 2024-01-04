import mongoose from 'mongoose'
import { getModelForClass, index, prop, ReturnModelType } from '@typegoose/typegoose'

import { PlanetNotFoundException } from '@/types/errors'

@index({ clientId: 1 })
export class Planet {
    public _id: mongoose.Types.ObjectId

    @prop({ required: true, unique: true })
    public title: string

    @prop({ required: true })
    public category: string

    @prop()
    public clientId: string

    @prop()
    public createdAt: Date

    @prop()
    public updatedAt: Date

    public static async findBytClientId(this: ReturnModelType<typeof Planet>, clientId: string): Promise<Planet> {
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

    public static async findByIdArray(this: ReturnModelType<typeof Planet>, ids: string[]): Promise<Planet[]> {
        return this.find({ _id: { $in: ids } })
    }
}

export const PlanetModel = getModelForClass(Planet)
