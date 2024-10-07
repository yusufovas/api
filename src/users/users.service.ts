import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UsersEntity } from "./entities/users.entity";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/users.dto";
import * as bcrypt from "bcrypt"
import { UpdateProfileDto } from "./dto/update.profile.dto";
import { Posts } from "src/posts/entities/posts.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UsersEntity.name) private usersModel: Model<UsersEntity>,
        @InjectModel(Posts.name) private readonly postModel: Model<Posts>    
    ) { }   
    async getAll() {
        return await this.usersModel
            .find()
            .populate('posts')
            .exec()
    }

    async findOne(username: string): Promise<UsersEntity> {
        const user = await this.usersModel.findOne({ username })
        if (!user) throw new HttpException('user with this username was not found', HttpStatus.NOT_FOUND)
        return user
    }

    async createUser(createUserDto: CreateUserDto): Promise<UsersEntity> {
        const email = createUserDto.email
        const ifExists = await this.usersModel.findOne({ email })
        if (ifExists) {
            throw new HttpException('this email was registered before', HttpStatus.BAD_REQUEST)
        }
        const salt = bcrypt.genSaltSync()
        const password = bcrypt.hashSync(createUserDto.password, salt)
        const createdUser = new this.usersModel({ ...createUserDto, password })
        await createdUser.save()
        return createdUser
    }

    async removeUser(_id: string) {
        await this.postModel.deleteMany({ user: _id })
        return await this.usersModel.findOneAndDelete({ _id: _id })
    }

    async deleteMyOwnProfile(_id: string) {
        const user = await this.usersModel.findById(_id)
        if (!user) throw new NotFoundException('user not found')
        return { message: 'user deleted', data: user._id }
    }

    async updateProfile(_id: string, updateProfileDto: UpdateProfileDto): Promise<UsersEntity> {
        const user = await this.usersModel.findById(_id)

        if (!user) throw new NotFoundException('user with this id doesn`t exists')

        const email = updateProfileDto.email
        const username = updateProfileDto.username

        if (email) {
            const existingUser = await this.usersModel.findOne({ email });
            if (existingUser && existingUser.id !== _id) {
                throw new ConflictException(`Email ${email} is already in use`);
            }
        }

        if (username) {
            const existingUser = await this.usersModel.findOne({ username })
            if (existingUser && existingUser.id !== _id) {
                throw new ConflictException(`Username ${username} is already in use`);
            }
        }

        Object.assign(user, updateProfileDto)
        return user.save()
    }
}