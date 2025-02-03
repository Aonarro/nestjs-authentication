import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  public async register(registerDto: RegisterDto) {}

  public async login() {}

  public async logOut() {}

  private async saveSession() {}
}
