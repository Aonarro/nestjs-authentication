import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register-dto.dto';
import { AuthMethod, User } from '../../prisma/schema/__generated__';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  public async register(req: Request, registerDto: RegisterDto) {
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
    this.saveSession(req, newUser);
    return newUser;
  }

  public async login() {}

  public async logOut() {}

  private async saveSession(req: Request, user: User) {
    console.log('Session saved. User: ', user);
    console.log('Session saved. User: ', user.id);

    console.log(req.session.userId);

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
