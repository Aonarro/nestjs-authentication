import { TokenType } from '../../prisma/__generated__';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';
import { PrismaService } from './../prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { hash } from 'argon2';
import { NewPasswordDto } from './dto/new-password.dto';

@Injectable()
export class PasswordRecoveryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  public async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const existingUser = await this.userService.findByEmail(
      resetPasswordDto.email,
    );

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const passwordResetToken = await this.generatePasswordResetToken(
      existingUser.email,
    );

    await this.mailService.sendResetPassword(
      existingUser.email,
      passwordResetToken.token,
    );

    return true;
  }

  public async newPassword(newPasswordDto: NewPasswordDto, token: string) {
    const existingToken = await this.prismaService.token.findFirst({
      where: {
        token,
        type: TokenType.PASSWORD_RESET,
      },
    });

    if (!existingToken) {
      throw new NotFoundException('Token not found');
    }

    const isExpired = new Date(existingToken.expiresIn) < new Date();

    if (isExpired) {
      throw new BadRequestException('Verification token is expired');
    }

    const existingUser = await this.userService.findByEmail(
      existingToken.email,
    );

    if (!existingUser) {
      throw new NotFoundException('User with this email is not found');
    }

    await this.prismaService.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        password: await hash(newPasswordDto.password),
      },
    });

    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.PASSWORD_RESET,
      },
    });

    return true;
  }

  private async generatePasswordResetToken(email: string) {
    const token = uuid();
    const expiresIn = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await this.prismaService.token.findFirst({
      where: {
        email,
        type: TokenType.PASSWORD_RESET,
      },
    });

    if (existingToken) {
      await this.prismaService.token.delete({
        where: {
          id: existingToken.id,
          type: TokenType.PASSWORD_RESET,
        },
      });
    }

    const passwordResetToken = await this.prismaService.token.create({
      data: {
        email,
        token,
        expiresIn,
        type: TokenType.PASSWORD_RESET,
      },
    });

    return passwordResetToken;
  }
}
