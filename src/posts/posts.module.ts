import { Module } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Posts, PostsSchema } from "./entities/posts.entity";
import { UsersEntity, UsersSchema } from "src/users/entities/users.entity";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Posts.name, schema: PostsSchema }]),
        MongooseModule.forFeature([{ name: UsersEntity.name, schema: UsersSchema }])
    ],
    providers: [PostsService],
    controllers: [PostsController]
})

export class PostsModule {}