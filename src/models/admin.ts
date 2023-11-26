import mongoose from 'mongoose'
import { getModelForClass, prop } from '@typegoose/typegoose'

export class Admin {
    public _id: mongoose.Types.ObjectId

    @prop({ require: true, unique: true })
    public email: string

    @prop({ required: true })
    public password: string

    @prop({ require: true, unique: true })
    public name: string

    @prop({ default: Date.now() })
    public registeredAt: Date

    @prop({ default: false })
    public approved: boolean

    @prop()
    public approvedAt: Date

    @prop()
    public createdAt: Date

    @prop()
    public updatedAt: Date
}

export const AdminModel = getModelForClass(Admin)
