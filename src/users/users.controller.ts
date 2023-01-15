import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Paginate } from '../shared/libs/utils/pagination';
import { ApiOkPaginationDecorator } from '../shared/libs/utils/pagination/paginated-ok-response';
import { PaginateParams } from '../shared/types/pagination.types';
import { CreateAgentDto } from './dtos/create-agent.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { ReadUserWithAgentProfileDto, ReadUserDto } from './dtos/read-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Create a new user',
  })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: ReadUserDto,
  })
  @ApiConflictResponse({
    description: 'User already exists',
  })
  @ApiBadRequestResponse({
    description: 'Invalid data',
  })
  async create(@Body() data: CreateUserDto) {
    return this.usersService.create(data);
  }

  @Post('agent')
  @ApiOperation({
    summary: 'Create a new agent',
    description: 'Create a new agent',
  })
  @ApiCreatedResponse({
    description: 'Agent created successfully',
    type: ReadUserWithAgentProfileDto,
  })
  @ApiConflictResponse({
    description:
      'User already exists or Agent with this ID Number already exists',
  })
  @ApiBadRequestResponse({
    description: 'Invalid data',
  })
  async createAgent(@Body() data: CreateAgentDto) {
    return this.usersService.createAgent(data);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Get all users',
  })
  @ApiQuery({
    type: PaginateParams,
  })
  @ApiOkPaginationDecorator(ReadUserDto, {
    description: 'Users retrieved successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid pagination parameters',
  })
  async findAll(@Paginate() paginateParams: PaginateParams) {
    return this.usersService.findAll(paginateParams);
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Get a user by ID',
    description: 'Get a user by ID',
  })
  @ApiOkResponse({
    description: 'User retrieved successfully',
    type: ReadUserWithAgentProfileDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
