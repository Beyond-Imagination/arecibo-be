import { DeleteResult } from 'mongodb'
import mongoose from 'mongoose'
import { getModelForClass, prop, ReturnModelType } from '@typegoose/typegoose'
import { OrganizationNotFoundException } from '@/types/errors/database'

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

    public static async findByServerUrl(this: ReturnModelType<typeof Organization>, serverUrl: string): Promise<Organization> {
        return this.findByFilter({ serverUrl })
    }

    public static async findByClientId(this: ReturnModelType<typeof Organization>, clientId: string): Promise<Organization> {
        return this.findByFilter({ clientId })
    }

    public static async deleteByClientId(this: ReturnModelType<typeof Organization>, clientId: string): Promise<DeleteResult> {
        return this.deleteOne({ clientId: clientId })
    }

    public static async updateServerUrlByClientId(this: ReturnModelType<typeof Organization>, clientId: string, newServerUrl: string): Promise<void> {
        await this.findOneAndUpdate({ clientId: clientId }, { serverUrl: newServerUrl })
    }

    private static async findByFilter(this: ReturnModelType<typeof Organization>, filter: object): Promise<Organization> {
        const organization = await this.findOne(filter).exec()
        if (organization) {
            return organization
        } else {
            throw new OrganizationNotFoundException()
        }
    }
}

export const OrganizationModel = getModelForClass(Organization)
