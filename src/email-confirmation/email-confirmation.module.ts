import { forwardRef, Module } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { EmailConfirmationController } from './email-confirmation.controller';
import { MailModule } from '../mail/mail.module';
import { AuthModule } from '../auth/auth.module';
// import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [MailModule, forwardRef(() => AuthModule)],
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService, UserService, MailService],
  exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
