import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../shared/libs/decorators/current-user.decorator';
import { ReadUserWithAgentProfileDto } from '../users/dtos/read-user.dto';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto } from './dtos/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Login',
    description: 'Get access token and refresh token',
  })
  @ApiOkResponse({
    description: 'Access token and refresh token',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  async login(@Body() credentials: LoginDto) {
    return this.authService.login(credentials);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Get logged in user',
    description: 'Get logged in user',
  })
  @ApiOkResponse({
    description: 'Logged in user',
    type: ReadUserWithAgentProfileDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async me(@CurrentUser() user: ReadUserWithAgentProfileDto) {
    return user;
  }
}
