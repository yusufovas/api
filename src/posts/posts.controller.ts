import { Controller, Post, Req, UseGuards, Body, Put, Param, Get, Delete } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create.post.dto";
import { Roles } from "src/auth/enums/roles.enum";
import { RolesGuard } from "src/guards/roles.guard";
import { JwtGuard } from "src/guards/jwt.guard";
import { UserRoles } from "src/auth/decorators/roles.decorator";
import { Request } from "express";
import { UpdatePostDto } from "./dto/update.post.dto";
import { Public } from "src/auth/decorators/public.decorator";
import { Posts } from "./entities/posts.entity";


@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Public()
    @Get('all')
    async getPosts(): Promise<Posts[]> {
        return await this.postsService.getAllPosts()
    }

    @UserRoles(Roles.Author)
    @UseGuards(RolesGuard, JwtGuard)
    @Post('create')
    async createPost(@Body() createPostDto: CreatePostDto, @Req() request: Request) {
        const userId = request.user['id']
        return await this.postsService.createPost(createPostDto, userId)
    }

    @UserRoles(Roles.Author)
    @UseGuards(JwtGuard, RolesGuard)
    @Put('update/:postId')
    async updatePost(@Body() updatePostDto: UpdatePostDto, @Req() request: Request, @Param('postId') postId: string) {
        const userId = request.user['id']
        return await this.postsService.updatePost(updatePostDto, userId, postId)
    }

    @Public()
    @Delete('remove/all')
    async removeAllPosts() {
        return await this.postsService.removeAllPosts()
    }
}
