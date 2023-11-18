import mongoose from 'mongoose'
import { getModelForClass, prop } from '@typegoose/typegoose'

export class Organization {
    public _id: mongoose.Types.ObjectId

    @prop({ required: true, unique: true })
    public clientId: string

    @prop({ required: true })
    public clientSecret: string

    @prop({ required: true, index: true })
    public serverUrl: string

    @prop({ type: String })
    public admin: string[]

    @prop()
    public version: string

    @prop()
    public createdAt: Date

    @prop()
    public updatedAt: Date
}

export const OrganizationModel = getModelForClass(Organization)
