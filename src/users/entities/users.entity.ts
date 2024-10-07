import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Roles } from "src/auth/enums/roles.enum";
import { Schema as MongooseSchema, Document } from 'mongoose'

@Schema({ timestamps: true })
export class UsersEntity {
    @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
    _id: MongooseSchema.Types.ObjectId

    @Prop({ lowercase: true, unique: true })
    username: string

    @Prop({ min: 6 })
    password: string

    @Prop({ lowercase: true, unique: true })
    email: string

    @Prop({ type: String, enum: Roles, default: Roles.Author })
    role: Roles

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Posts' }] })
    posts: MongooseSchema.Types.ObjectId[]
    // @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Comment' }] })
    // comments: MongooseSchema.Types.ObjectId[]
}

export type UserDocument = UsersEntity & Document
export const UsersSchema = SchemaFactory.createForClass(UsersEntity)
