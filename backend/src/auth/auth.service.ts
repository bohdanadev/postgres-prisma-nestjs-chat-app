import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { LoginDto, RegisterDto } from './dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    let payload;

    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    const userExists = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!userExists) {
      throw new BadRequestException('User no longer exists');
    }

    // const expiresIn = this.configService.get<number>('ACCESS_EXPIRES_IN');
    // const expiration = Math.floor(Date.now() / 1000) + expiresIn;
    const accessToken = this.jwtService.sign(
      { ...payload },
      {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get<number>('ACCESS_EXPIRES_IN'),
      },
    );
    res.cookie('access_token', accessToken, { httpOnly: true });

    return accessToken;
  }
  private async issueTokens(user: User, response: Response) {
    const payload = { username: user.fullname, sub: user.id };
    //const expiresIn = this.configService.get<number>('ACCESS_EXPIRES_IN');
    //const expiration = Math.floor(Date.now() / 1000) + expiresIn;

    const accessToken = this.jwtService.sign(
      { ...payload },
      {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get<number>('ACCESS_EXPIRES_IN'),
      },
    );
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<number>('REFRESH_EXPIRES_IN'),
    });

    response.cookie('access_token', accessToken, { httpOnly: true });
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
    });
    return { user };
  }

  async validateUser(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });
    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      return user;
    }
    return null;
  }
  async register(registerDto: RegisterDto, response: Response) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });
    if (existingUser) {
      throw new BadRequestException({ email: 'Email already in use' });
    }
    const saltOrRounds = this.configService.get<number>('SALT_OR_ROUNDS');
    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      saltOrRounds,
    );
    const user = await this.prisma.user.create({
      data: {
        fullname: registerDto.fullname,
        password: hashedPassword,
        email: registerDto.email,
      },
    });
    return this.issueTokens(user, response);
  }

  async login(loginDto: LoginDto, response: Response) {
    const user = await this.validateUser(loginDto);
    if (!user) {
      throw new BadRequestException({
        invalidCredentials: 'Invalid credentials',
      });
    }
    return this.issueTokens(user, response);
  }
  async logout(response: Response) {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
    return 'Successfully logged out';
  }
}
