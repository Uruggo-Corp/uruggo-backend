import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HelpersService } from '../shared/libs/helpers/helpers.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly helpersService: HelpersService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmailWithPassword(email);

    if (
      user &&
      (await this.helpersService.comparePassword(password, user.password))
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await this.usersService.findOneByEmail(email);
      return result;
    }
    return null;
  }

  async login(credentials: LoginDto) {
    const user = await this.validateUser(
      credentials.email,
      credentials.password,
    );

    // console.log(user);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.helpersService.generateAccessToken(user);
    const refreshToken = await this.helpersService.generateRefreshToken(user);
    return { accessToken, refreshToken };
  }
}
