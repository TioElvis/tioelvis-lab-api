import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail({ host_whitelist: ['gmail.com'] })
  email: string;

  @IsString()
  password: string;
}
