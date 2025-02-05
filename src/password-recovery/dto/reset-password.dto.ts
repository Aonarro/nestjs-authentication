import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail({}, { message: 'incorrect email' })
  @IsNotEmpty({ message: 'email cannot be empty' })
  email: string;
}
