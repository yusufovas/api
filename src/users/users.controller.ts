import { Body, Controller, Post, Get, Req, UseGuards, Delete, Param, ForbiddenException, Put } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/users.dto";
import { Public } from "src/auth/decorators/public.decorator";
import { UserRoles } from "src/auth/decorators/roles.decorator";
import { Roles } from "src/auth/enums/roles.enum";
import { RolesGuard } from "src/guards/roles.guard";
import { Request } from "express";
import { JwtGuard } from "src/guards/jwt.guard";
import { UpdateProfileDto } from "./dto/update.profile.dto";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Public()
    @Post('create')
    async createUser(@Body() createUserDto: CreateUserDto) {
        return await this.usersService.createUser(createUserDto)
    }

    @Public()
    @Get('get_user/:id')
    async getUser(@Param('id') id: string) {
        return await this.usersService.findOne(id)
    }

    @Public()
    @Get('all')
    async getAllUsers() {
        return await this.usersService.getAll()
    }

    @UserRoles(Roles.Author)
    @UseGuards(RolesGuard, JwtGuard)
    @Delete('remove/:id')
    async deleteUser(@Param('id') id: string): Promise<void> {
        await this.usersService.removeUser(id)
    }

    @UserRoles(Roles.Author)
    @UseGuards(RolesGuard, JwtGuard)
    @Delete('delete/profile')
    async deleteMyProfile(@Req() request: Request) {
        if (request.user['role'] === Roles.Author) {
            return await this.usersService.deleteMyOwnProfile(request.user['id'])
        }
        throw new ForbiddenException('you can`t delete this user')
    }

    @UserRoles(Roles.Admin, Roles.Author)
    @UseGuards(RolesGuard, JwtGuard)
    @Put('profile/update')
    async updateProfile(@Req() req: Request, @Body() updateProfileDto: UpdateProfileDto) {
        const id = req.user['id']
        return this.usersService.updateProfile(id, updateProfileDto)
    }
}