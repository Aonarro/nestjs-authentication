import { UserModule } from './../user/user.module';
import { forwardRef, Module } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { EmailConfirmationController } from './email-confirmation.controller';
import { MailModule } from '../mail/mail.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UserModule, MailModule, forwardRef(() => AuthModule)],
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService],
  exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
