import { Model } from 'mongoose';
import { hashSync } from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';

import { User, UserDocument } from './user.schema';

import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create({ email, ...body }: CreateUserDto) {
    const existingUser = await this.userModel.findOne({ email });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = hashSync(body.password, 12);

    const payload: User = {
      email,
      name: body.name,
      password: hashedPassword,
    };

    try {
      await this.userModel.create(payload);

      return 'User created successfully';
    } catch (error) {
      console.error('Error creating user:', error);
      throw new BadRequestException('Failed to create user');
    }
  }
}
