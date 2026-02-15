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

  async signIn({ email, password }: SignInDto, res: FastifyReply) {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isValidPassword = compareSync(password, user.password);

    if (!isValidPassword) {
      throw new BadRequestException('Invalid email or password');
    }

    const jwt = this.jwtService.sign({
      id: user._id,
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
