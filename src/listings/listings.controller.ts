import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dtos/create-listing.dto';
import { ReadListingDto } from './dtos/read-listing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import RoleGuard from '../auth/guards/role.guard';
import { Role, User } from '../users/schemas/user.schema';
import { CurrentUser } from '../shared/libs/decorators/current-user.decorator';

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
  async create(
    @Body() data: CreateListingDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.listingsService.create(data, currentUser);
  }
}
