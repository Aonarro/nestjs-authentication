import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [UserModule, ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, UserService, ConfigService],
})
export class AuthModule {}
