import { IsNotEmpty, IsOptional, IsString, Max, Min } from "class-validator";

export class UpdatePostDto {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsOptional() 
    @IsString()
    @Max(400)
    @Min(15)
    content: string
}