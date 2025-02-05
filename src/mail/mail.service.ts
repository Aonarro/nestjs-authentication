import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

import { getConfirmationTemplate } from './templates/confirmation.template';
import { getRestorePasswordTemplate } from './templates/restore-password.template';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  public async sendConfirmationEmail(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
    const html = getConfirmationTemplate(domain, token);

    return this.sendMail(email, 'Email verification', html);
  }

  public async sendResetPassword(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
    const html = getRestorePasswordTemplate(domain, token);

    return this.sendMail(email, 'Restore password', html);
  }

  private sendMail(email: string, subject: string, html: string) {
    return this.mailerService.sendMail({
      to: email,
      subject,
      html,
    });
  }
}
