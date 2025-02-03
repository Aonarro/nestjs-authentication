import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { Logger, ValidationPipe } from '@nestjs/common';
import IORedis from 'ioredis';
import { RedisStore } from 'connect-redis';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const redis = new IORedis(config.getOrThrow('REDIS_URI'));

  app.use(cookieParser(config.getOrThrow('COOKIES_SECRET')));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  console.log(
    typeof +config.getOrThrow<number>('SESSION_MAX_AGE') === 'number',
  );

  app.use(
    session({
      secret: config.getOrThrow<string>('SESSION_SECRET'),
      name: config.getOrThrow<string>('SESSION_NAME'),
      resave: true,
      saveUninitialized: false,
      cookie: {
        domain: config.getOrThrow<string>('SESSION_DOMAIN'),
        secure: config.getOrThrow<boolean>('SESSION_SECURE'),
        httpOnly: config.getOrThrow<boolean>('SESSION_HTTP_ONLY'),
        maxAge: Number(config.getOrThrow<number>('SESSION_MAX_AGE')),
        sameSite: 'lax',
      },
      store: new RedisStore({
        client: redis,
        prefix: config.getOrThrow<string>('SESSION_FOLDER'),
      }),
    }),
  );

  app.enableCors({
    origin: '*',
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });

  await app.listen(config.getOrThrow('APP_PORT'));
  Logger.log(
    `Server running on http://localhost:${config.getOrThrow('APP_PORT')}`,
  );
}
bootstrap();
