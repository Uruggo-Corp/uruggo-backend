import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Param,
  NotFoundException,
  Patch,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiQuery,
  ApiNotFoundResponse,
  ApiBearerAuth
} from '@nestjs/swagger';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dtos/create-listing.dto';
import {
  ReadListingDto,
  ReadListingWithAgentDto,
} from './dtos/read-listing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import RoleGuard from '../auth/guards/role.guard';
import { Role, User } from '../users/schemas/user.schema';
import { CurrentUser } from '../shared/libs/decorators/current-user.decorator';
import { ApiOkPaginationDecorator } from '../shared/libs/utils/pagination/paginated-ok-response';
import { PaginateParams } from '../shared/types/pagination.types';
import { Paginate } from '../shared/libs/utils/pagination';

@Controller('listings')
@ApiTags('Listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new listing',
    description: 'Create a new listing',
  })
  @ApiOkResponse({
    description: 'The listing was successfully created',
    type: ReadListingDto,
  })
  @ApiBadRequestResponse({
    description: 'The listing could not be created',
  })
  @UseGuards(JwtAuthGuard, RoleGuard([Role.ADMIN, Role.AGENT]))
  @ApiBearerAuth()
  async create(
    @Body() data: CreateListingDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.listingsService.create(data, currentUser);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all listings',
    description: 'Get all listings',
  })
  @ApiOkPaginationDecorator(ReadListingDto, {
    description: 'The listings were successfully retrieved',
  })
  @ApiBadRequestResponse({
    description: 'Invalid pagination parameters',
  })
  @ApiQuery({
    type: PaginateParams,
  })
  async findAll(
    @Paginate() paginateParams: PaginateParams,
    @Query('search') search: string,
  ) {
    if (search) {
      return this.listingsService.search(search, paginateParams);
    }
    return this.listingsService.findAll(paginateParams);
  }

  @Get(':slug')
  @ApiOperation({
    summary: 'Get a listing by slug',
    description: 'Get a listing by slug',
  })
  @ApiOkResponse({
    description: 'The listing was successfully retrieved',
    type: ReadListingWithAgentDto,
  })
  @ApiNotFoundResponse({
    description: 'The listing could not be retrieved',
  })
  async findBySlug(@Param('slug') slug: string) {
    const listing = await this.listingsService.findBySlug(slug);
    if (!listing) {
      throw new NotFoundException("The listing doesn't exist");
    }

    return listing;
  }

  @Patch(':slug/mark-as-active')
  @ApiOperation({
    summary: 'Mark a listing as active',
    description: 'Mark a listing as active',
  })
  @ApiOkResponse({
    description: 'The listing was successfully marked as active',
    type: ReadListingWithAgentDto,
  })
  @ApiNotFoundResponse({
    description: 'The listing could not be marked as active',
  })
  @UseGuards(JwtAuthGuard, RoleGuard([Role.ADMIN]))
  async markAsActive(@Param('slug') slug: string) {
    return this.listingsService.markAsActive(slug);
  }

  @Patch(':slug/mark-as-closed')
  @ApiOperation({
    summary: 'Mark a listing as closed',
    description: 'Mark a listing as closed',
  })
  @ApiOkResponse({
    description: 'The listing was successfully marked as closed',
    type: ReadListingWithAgentDto,
  })
  @ApiNotFoundResponse({
    description: 'The listing could not be marked as closed',
  })
  @UseGuards(JwtAuthGuard, RoleGuard([Role.AGENT]))
  async markAsClosed(@Param('slug') slug: string, @CurrentUser() user: User) {
    return this.listingsService.markAsClosed(slug, user);
  }

  @Patch(':slug/mark-as-rented')
  @ApiOperation({
    summary: 'Mark a listing as rented',
    description: 'Mark a listing as rented',
  })
  @ApiOkResponse({
    description: 'The listing was successfully marked as rented',
    type: ReadListingWithAgentDto,
  })
  @ApiNotFoundResponse({
    description: 'The listing could not be marked as rented',
  })
  @UseGuards(JwtAuthGuard, RoleGuard([Role.AGENT]))
  async markAsRented(@Param('slug') slug: string, @CurrentUser() user: User) {
    return this.listingsService.markAsRented(slug, user);
  }
}
