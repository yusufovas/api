import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { LocalStrategy } from "./strategies/local.startegy";
import { JwtStrategy } from "./strategies/jwt.startegy";
import { PassportModule } from "@nestjs/passport";

@Module({
    imports: [UsersModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: () => ({
                secret: process.env.KEY,
                signOptions: {
                    expiresIn: '1h'
                }
            }),
            inject: [ConfigService]
        })
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService, JwtModule]
})

export class AuthModule { }