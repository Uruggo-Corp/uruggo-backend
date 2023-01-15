import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { ReadUserDto } from '../../../users/dtos/read-user.dto';

@Injectable()
export class HelpersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await argon2.verify(hashedPassword, password);
  }

  async generateAccessToken(user: ReadUserDto): Promise<string> {
    const payload = { email: user.email, sub: user._id, scope: 'access_token' };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION'),
    });
  }

  async generateRefreshToken(user: ReadUserDto): Promise<string> {
    const payload = {
      email: user.email,
      sub: user._id,
      scope: 'refresh_token',
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION'),
    });
  }

  async verifyRefreshToken(token: string): Promise<string> {
    const payload = await this.jwtService.verify(token, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
    });

    if (payload.scope !== 'refresh_token') {
      throw new UnauthorizedException('Invalid token scope');
    }

    return payload.sub;
  }
}
