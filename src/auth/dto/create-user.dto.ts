import { IsBoolean, IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {

    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @MinLength(6)
    password: string;

    @IsString()
    password2: string;
    @IsBoolean()
    terminos: boolean;
}
