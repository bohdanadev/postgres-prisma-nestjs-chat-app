import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { verify } from 'jsonwebtoken';
import { Config, JWTConfig } from 'src/config/config.type';

@Injectable()
export class TokenService {
  private readonly jwtConfig: JWTConfig;
  constructor(private readonly configService: ConfigService<Config>) {
    this.jwtConfig = configService.get<JWTConfig>('jwt');
  }

  extractToken(connectionParams: any): string | null {
    return connectionParams?.token || null;
  }

  validateToken(token: string): any {
    const refreshTokenSecret = this.jwtConfig.refreshSecret;
    try {
      return verify(token, refreshTokenSecret);
    } catch (error) {
      return null;
    }
  }
}
