import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { LoginDto } from "src/users/dto/login.dto";
import { CreateUserDto } from "src/users/dto/users.dto";
import { UsersService } from "src/users/users.service";
import * as bcrypt from "bcrypt"
import { AccessToken } from "./interfaces/accessToken.interface";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async register(createUserDto: CreateUserDto): Promise<AccessToken> {
        const user = await this.usersService.createUser(createUserDto)
        const payload = { id: user._id, role: user.role }
        return { token: this.jwtService.sign(payload) }
    }

    async login(loginDto: LoginDto): Promise<AccessToken> {
        const user = await this.usersService.findOne(loginDto.username)
        const payload = { id: user._id, role: user.role }
        const isMatch = bcrypt.compareSync(loginDto.password, user.password)
        if (isMatch) {
            return { token: this.jwtService.sign(payload) }
        }
        throw new HttpException('wrong password!', HttpStatus.BAD_REQUEST)
    }

    async validateUser(username: string, password: string) {
        const user = await this.usersService.findOne(username)
        if (!user) {
            throw new BadRequestException('user not found')
        }

        const isMatch = bcrypt.compareSync(password, user.password)
        if (!isMatch) {
            throw new BadRequestException('password didn`t match')
        }
        return user
    }
}