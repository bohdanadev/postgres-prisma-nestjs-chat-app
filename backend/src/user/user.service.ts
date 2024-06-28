import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

  async updateProfile(userId: number, fullname: string, avatarUrl: string) {
    if (avatarUrl) {
      const oldUser = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          fullname,
          avatarUrl,
        },
      });
    }
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        fullname,
      },
    });
  }
}
