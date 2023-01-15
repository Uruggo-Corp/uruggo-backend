import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginatedResultDto } from '../../../types/pagination.types';

export const ApiOkPaginationDecorator = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  options?: ApiResponseOptions,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResultDto) },
          {
            properties: {
              data: { type: 'array', items: { $ref: getSchemaPath(dataDto) } },
            },
          },
        ],
      },
      ...options,
    }),
    ApiExtraModels(PaginatedResultDto, dataDto),
  );
};
