import { Body, ForbiddenException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Posts } from "./entities/posts.entity";
import { Model } from "mongoose";
import { CreatePostDto } from "./dto/create.post.dto";
import { UsersEntity } from "src/users/entities/users.entity";
import { UpdatePostDto } from "./dto/update.post.dto";

@Injectable()
export class PostsService {
    constructor(@InjectModel(Posts.name) private postsModel: Model<Posts>, @InjectModel(UsersEntity.name) private usersModel: Model<UsersEntity>) { }

    async getAllPosts(): Promise<Posts[]> {
        return await this.postsModel.find().exec()
    }

    async createPost(createPostDto: CreatePostDto, userId: string): Promise<Posts> {
        const newPost = new this.postsModel({ ...createPostDto, user: userId })
        const savedPost = await newPost.save()
        await this.usersModel.findByIdAndUpdate(
            userId,

            { $push: { posts: savedPost._id } },
            { new: true }
        )
        return savedPost
    }

    async updatePost(updatePostDto: UpdatePostDto, userId: string, postId: string): Promise<Posts> {
        const findPost = await this.postsModel.findById(postId)
        if (findPost.user.toString() !== userId) {
            throw new ForbiddenException('you have not authorized to change this post')
        }
        const updatedPost = await this.postsModel.findByIdAndUpdate(
            postId,
            { $set: updatePostDto },
            { new: true }
        )
        return updatedPost
    }

    async removeAllPosts() {
        return await this.postsModel.deleteMany({})
    }
}