import { IsEmail, IsBoolean, IsString, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'email cannot be empty' })
  email: string;

  @IsBoolean({ message: 'isTwoFactorEnabled must be a boolean value' })
  isTwoFactorEnabled: boolean;
}
