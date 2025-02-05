import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { PasswordRecoveryService } from './password-recovery.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { NewPasswordDto } from './dto/new-password.dto';

@Controller('password-recovery')
export class PasswordRecoveryController {
  constructor(
    private readonly passwordRecoveryService: PasswordRecoveryService,
  ) {}

  @Recaptcha()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  public async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.passwordRecoveryService.resetPassword(resetPasswordDto);
  }

  @Recaptcha()
  @Post('new-password/:token')
  @HttpCode(HttpStatus.OK)
  public async newPassword(
    @Body() newPasswordDto: NewPasswordDto,
    @Param('token') token: string,
  ) {
    return this.passwordRecoveryService.newPassword(newPasswordDto, token);
  }
}
