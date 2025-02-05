import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class NewPasswordDto {
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password length must be at least 6 characters' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;
}
