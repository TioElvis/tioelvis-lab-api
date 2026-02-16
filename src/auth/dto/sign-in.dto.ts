import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsEmail({ host_whitelist: ['gmail.com'] })
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
