import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { AuthMethod, User } from '../../prisma/schema/__generated__';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { verify } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { ProviderService } from './provider/provider.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly providerService: ProviderService,
    private readonly prismaService: PrismaService,
  ) {}

  public async register(req: Request, registerDto: RegisterDto): Promise<User> {
    const isUserExist = await this.userService.findByEmail(registerDto.email);

    if (isUserExist) {
      throw new ConflictException('User already exist');
    }

    const newUser = await this.userService.create(
      registerDto.email,
      registerDto.password,
      registerDto.displayName,
      '',
      AuthMethod.CREDENTIALS,
      false,
    );
    await this.saveSession(req, newUser);
    return newUser;
  }

  public async login(
    req: Request,
    loginDto: LoginDto,
  ): Promise<{ user: User }> {
    const user = await this.userService.findByEmail(loginDto.email);

    if (!user || !user.password) {
      throw new NotFoundException('User not found');
    }

    const isValidPassword = await verify(user.password, loginDto.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return await this.saveSession(req, user);
  }

  public async extractProfileFromCode(
    req: Request,
    provider: string,
    code: string,
  ) {
    const providerInstance = this.providerService.findByService(provider);
    const profile = await providerInstance.findUserByCode(code);

    const account = await this.prismaService.account.findFirst({
      where: {
        id: profile.id,
        provider: profile.provider,
      },
    });

    let user = account?.userId
      ? await this.userService.findById(account.userId)
      : null;

    if (user) {
      return this.saveSession(req, user);
    }

    user = await this.userService.create(
      profile.email,
      '',
      profile.name,
      profile.picture,
      AuthMethod[profile.provider.toUpperCase()],
      true,
    );

    if (!account) {
      await this.prismaService.account.create({
        data: {
          id: user.id,
          type: 'oauth',
          provider: profile.provider,
          accessToken: profile.access_token,
          refreshToken: profile.refresh_token,
          expiresAt: profile.expires_at,
        },
      });
    }

    return this.saveSession(req, user);
  }

  public async logOut(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('Текущая сессия перед удалением:', req.session);

      req.session.destroy((err) => {
        if (err) {
          return reject(new InternalServerErrorException('Failed to log out'));
        } else {
          res.clearCookie('session');
          resolve();
        }
      });
    });
  }

  private async saveSession(req: Request, user: User): Promise<{ user: User }> {
    return new Promise((resolve, reject) => {
      req.session.userId = user.id;
      req.session.save((err) => {
        if (err) {
          return reject(new InternalServerErrorException());
        } else {
          resolve({
            user,
          });
        }
      });
    });
  }
}
