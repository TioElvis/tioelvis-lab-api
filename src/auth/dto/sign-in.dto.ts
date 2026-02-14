import { IsEmail, IsString } from 'class-validator';

export class SignInDto {
  @IsEmail({ host_whitelist: ['gmail.com'] })
  email: string;

  @IsString()
  password: string;
}
