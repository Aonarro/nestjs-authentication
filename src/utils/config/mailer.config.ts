import { ConfigService } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';
import { isDev } from '../is-dev.util';

export const getMailerConfig = async (
  configService: ConfigService,
): Promise<MailerOptions> => {
  return {
    transport: {
      host: configService.getOrThrow<string>('MAIL_HOST'),
      port: configService.getOrThrow<number>('MAIL_PORT'),
      secure: !isDev(configService),
      auth: {
        user: configService.getOrThrow<string>('MAIL_LOGIN'),
        pass: configService.getOrThrow<string>('MAIL_PASSWORD'),
      },
    },
    defaults: {
      from: `"Nestjs-auth" ${configService.getOrThrow<string>('MAIL_LOGIN')}`,
    },
  };
};
