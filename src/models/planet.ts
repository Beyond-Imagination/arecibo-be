import mongoose from 'mongoose'
import { getModelForClass, prop } from '@typegoose/typegoose'

export class Planet {
    public _id: mongoose.Types.ObjectId

    @prop({ required: true, unique: true })
    public title: string

    @prop({ required: true })
    public category: string

    @prop()
    public createdAt: Date

    @prop()
    public updatedAt: Date
}

export const PlanetModel = getModelForClass(Planet)
