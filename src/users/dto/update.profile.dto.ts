import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    @IsEmail()
    readonly email?: string

    @IsOptional()
    @IsString()
    readonly password?: string

    @IsOptional()
    @IsString()
    readonly username?: string
}