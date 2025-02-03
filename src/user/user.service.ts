import { AuthMethod } from '../../prisma/schema/__generated__';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        accounts: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  public async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        accounts: true,
      },
    });
    return user;
  }

  public async create(
    email: string,
    password: string,
    displayName: string,
    pictureUrl: string,
    method: AuthMethod,
    isVerified: boolean,
  ) {
    const user = this.prismaService.user.create({
      data: {
        email,
        password: password ? await hash(password) : '',
        displayName,
        pictureUrl,
        method,
        isVerified,
      },
      include: {
        accounts: true,
      },
    });

    return user;
  }
}
