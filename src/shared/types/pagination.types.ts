import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  itemCount: number;

  @ApiProperty({ example: 10 })
  totalItems: number;

  @ApiProperty({ example: 10 })
  itemsPerPage: number;

  @ApiProperty({ example: 1 })
  totalPages: number;

  @ApiProperty({ example: 1 })
  currentPage: number;
}

export class PaginatedResultDto<T> {
  // @ApiProperty({ type: [T] })
  data: T[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class PaginateParams {
  @ApiProperty({ default: 1 })
  page: number;

  @ApiProperty({ maximum: 100, minimum: 1, default: 10 })
  limit: number;

  @ApiProperty({ required: false })
  filter?: { [key: string]: string };

  @ApiProperty({ required: false, example: { 'sort.name': 'asc' } })
  sort?: { [key: string]: string }[];
}
