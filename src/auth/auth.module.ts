import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { getRecaptchaConfig } from '../utils/config/recapthca.config';
import { ProviderModule } from './provider/provider.module';
import { getProvidersConfig } from '../utils/config/providers.config';
import { EmailConfirmationModule } from '../email-confirmation/email-confirmation.module';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    GoogleRecaptchaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getRecaptchaConfig,
      inject: [ConfigService],
    }),
    ProviderModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getProvidersConfig,
      inject: [ConfigService],
    }),
    forwardRef(() => EmailConfirmationModule),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
