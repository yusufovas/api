import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { UsersSchema, UsersEntity } from "./entities/users.entity";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";
import { Posts, PostsSchema } from "src/posts/entities/posts.entity";


@Module({
    imports: [
        MongooseModule.forFeature([{ name: UsersEntity.name, schema: UsersSchema }]),
        MongooseModule.forFeature([{ name: Posts.name, schema: PostsSchema }])
    ],
    providers: [UsersService, JwtService],
    controllers: [UsersController],
    exports: [UsersService]
})

export class UsersModule {}