import { Model } from 'mongoose';
import { compareSync } from 'bcrypt';
import { FastifyReply } from 'fastify';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';

import { User, UserDocument } from 'src/user/user.schema';

import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signIn({ username, password }: SignInDto, res: FastifyReply) {
    const existingUser = await this.userModel.findOne({ username }).exec();

    if (!existingUser) {
      throw new BadRequestException('Invalid username or password');
    }

    const isValidPassword = compareSync(password, existingUser.password);

    if (!isValidPassword) {
      throw new BadRequestException('Invalid username or password');
    }

    const jwt = this.jwtService.sign({
      id: existingUser._id,
    });

    res.setCookie('token', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
      domain:
        process.env.NODE_ENV === 'production'
          ? `.${process.env.DOMAIN}`
          : 'localhost',
      signed: true,
    });

    return 'Signed in successfully';
  }

  signOut(res: FastifyReply) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      domain:
        process.env.NODE_ENV === 'production'
          ? `.${process.env.DOMAIN}`
          : 'localhost',
      signed: true,
    });

    return 'Signed out successfully';
  }
}
