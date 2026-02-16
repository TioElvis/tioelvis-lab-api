import * as bcrypt from 'bcrypt';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { User } from './user.schema';
import { UserService } from './user.service';

import { CreateUserDto } from './dto/create-user.dto';

jest.mock('bcrypt', () => ({
  hashSync: jest.fn().mockReturnValue('hashedPassword'),
}));

describe('UserService', () => {
  let service: UserService;

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const mockData: CreateUserDto = {
      name: 'Test User',
      email: 'test@gmail.com',
      password: 'password123',
    };

    it('should create a user', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue({});

      (bcrypt.hashSync as jest.Mock).mockReturnValue('hashedPassword');

      const result = await service.create(mockData);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: mockData.email,
      });

      expect(bcrypt.hashSync).toHaveBeenCalledWith('password123', 12);

      expect(mockUserModel.create).toHaveBeenCalled();

      expect(result).toBe('User created successfully');
    });

    it('should throw an error if user already exists', async () => {
      mockUserModel.findOne.mockResolvedValue(mockData);

      await expect(service.create(mockData)).rejects.toThrow(
        BadRequestException,
      );

      await expect(service.create(mockData)).rejects.toThrow(
        'User with this email already exists',
      );

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: mockData.email,
      });

      expect(mockUserModel.create).not.toHaveBeenCalled();
      expect(bcrypt.hashSync).not.toHaveBeenCalled();
    });
  });
});
