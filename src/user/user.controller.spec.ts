import { AuthGuard } from '@nestjs/passport';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UserService } from './user.service';
import { UserController } from './user.controller';

import { CreateUserDto } from './dto/create-user.dto';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UserController>(UserController);

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
      mockUserService.create.mockResolvedValue('User created successfully');

      const result = await controller.create(mockData);

      expect(mockUserService.create).toHaveBeenCalledWith(mockData);
      expect(result).toBe('User created successfully');
    });

    it('should throw an error if user creation fails', async () => {
      mockUserService.create.mockRejectedValue(
        new BadRequestException('User with this email already exists'),
      );

      await expect(controller.create(mockData)).rejects.toThrow(
        BadRequestException,
      );

      await expect(controller.create(mockData)).rejects.toThrow(
        'User with this email already exists',
      );

      expect(mockUserService.create).toHaveBeenCalledWith(mockData);
    });
  });
});
