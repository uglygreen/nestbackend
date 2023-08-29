import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';

import { CreateUserDto , UpdateAuthDto, LoginDto, RegisterDto} from './dto';

@Injectable()
export class AuthService {


  constructor( 
    @InjectModel( User.name ) 
    private userMdel: Model<User>,

    private jwtService: JwtService
  ){

  }

  async create(createUserDto: CreateUserDto): Promise<User> {   

    try {
      const { password, ...userData} = createUserDto;

      
      const newUser = new this.userMdel({
        password: bcryptjs.hashSync(password, 10),
        ...userData
      });


      await newUser.save();
      const {password:_, ...user} = newUser.toJSON();

      return user;

      
    } catch (error) {
      console.log(error.code)
      if(error.code === 11000){
        throw new BadRequestException(`${ createUserDto.email } ya existe`)
      }
      throw new InternalServerErrorException('Error inesperado!');
    }

    
  }
  async login(loginDto: LoginDto): Promise<LoginResponse>{

    const { email, password} = loginDto;

    const user = await this.userMdel.findOne({ email });
    if(!user){
      throw new UnauthorizedException('Credenciales no validas');
    }

    if( !bcryptjs.compareSync( password, user.password)){
      throw new UnauthorizedException('Credenciales no validas');
    }

    const { password:_, ...rest} = user.toJSON();

    return {
      user: rest,
      token: this.getJwtToken({id: user.id}),
    }

  }
  async register(registerDto: RegisterDto): Promise<LoginResponse>{

    const user = await this.create(registerDto);

    return{
      user: user,
      token: this.getJwtToken({id: user._id}),
    }
  }

  async findUserById( id: string){
    const user = await this.userMdel.findById(id);

    const { password, ...rest}= user.toJSON();

    return rest;
  }
  findAll(): Promise<User[]> {
    return this.userMdel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }


  getJwtToken(payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;

  }
}
