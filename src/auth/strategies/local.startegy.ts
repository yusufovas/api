import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy } from "passport-local"
import { PassportStrategy } from '@nestjs/passport'
import { UsersEntity } from "src/users/entities/users.entity";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            username: 'username'
        })
    }

    async validate(username: string, password: string): Promise<UsersEntity> {
        const user = await this.authService.validateUser(username, password)
        if (!user) throw new UnauthorizedException('not found')
        return user;
    }
}