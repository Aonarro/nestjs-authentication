import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

export const isDev = (configService: ConfigService): boolean =>
  configService.getOrThrow('NODE_ENV') === 'development';

export const IS_DEV = process.env.NODE_ENV === 'development';
