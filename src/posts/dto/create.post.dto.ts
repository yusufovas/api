import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    readonly title: string

    @IsOptional()
    @IsString()
    readonly content: string
}