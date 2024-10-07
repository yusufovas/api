import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Schema as MongooseSchema } from 'mongoose'
@Schema()
export class Posts extends Document {

    @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
    _id: MongooseSchema.Types.ObjectId

    @Prop({ required: true })
    title: string

    @Prop()
    content: string

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'UsersEntity', required: true})
    user: MongooseSchema.Types.ObjectId

    // @Prop({type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Comment' }] })
    // comments: MongooseSchema.Types.ObjectId[]
}

export const PostsSchema = SchemaFactory.createForClass(Posts)