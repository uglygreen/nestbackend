import { IsBoolean, IsEmail, IsString, MinLength } from "class-validator";



export class RegisterDto{

    @IsString()
    name: string;

    @IsEmail()
    email: string;
    
    @MinLength(6)
    password: string;
    @IsString()
    password2: string;
    @IsBoolean()
    terminos: boolean;
}