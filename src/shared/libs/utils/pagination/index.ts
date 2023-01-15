import { Model, FilterQuery } from 'mongoose';
import {
  PaginatedResultDto,
  PaginateParams,
  PaginationMetaDto,
} from '../../../types/pagination.types';
import { pickBy, map, isString, Dictionary } from 'lodash';
import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const Paginate = createParamDecorator(
  (_, ctx: ExecutionContext): PaginateParams => {
    const request = ctx.switchToHttp().getRequest();
    const { query } = request;
    const defaultPageSize = 10;

    const page = query.page ? parseInt(query.page, 10) : 1;
    const limit = query.limit ? parseInt(query.limit, 10) : defaultPageSize;

    // Sanitize filter to remove filter. prefix and convert to object
    const filterList = map(
      pickBy(
        query,
        (param, name) =>
          name.includes('filter.') &&
          (isString(param) ||
            (Array.isArray(param) &&
              (param as any[]).every((p) => isString(p)))),
      ) as Dictionary<string[]>,
      (value, key) => {
        return {
          [key.replace('filter.', '')]: value,
        };
      },
    );

    // Convert filter to mongoose filter query
    const filter = filterList.reduce((acc, curr) => {
      return {
        ...acc,
        ...curr,
      };
    }, {} as FilterQuery<any>);

    // Sanitize sort to remove sort. prefix and convert to list of arrays
    const sort = map(
      pickBy(
        query,
        (param, name) =>
          name.includes('sort.') &&
          (isString(param) ||
            (Array.isArray(param) &&
              (param as any[]).every((p) => isString(p)))),
      ) as Dictionary<string[]>,
      (value, key) => {
        if (value !== 'asc' && value !== 'desc') {
          throw new BadRequestException(
            'Invalid sort value, must be asc or desc',
          );
        }
        return [key.replace('sort.', ''), value === 'desc' ? -1 : 1];
      },
    );

    return {
      page,
      limit,
      filter,
      sort,
    };
  },
);

export const getPaginatedResult = async <T>(
  model: Model<T>,
  paginateParams: PaginateParams,
  populate?: string,
): Promise<PaginatedResultDto<T>> => {
  const startIndex = (paginateParams.page - 1) * paginateParams.limit;

  console.log(paginateParams);

  const results: T[] = await model
    .find(paginateParams.filter as FilterQuery<T>)
    .limit(paginateParams.limit)
    .skip(startIndex)
    .sort(paginateParams.sort as Dictionary<string>)
    .select('-password')
    .populate(populate);

  const total = await model.countDocuments(
    paginateParams.filter as FilterQuery<T>,
  );

  const pagination: PaginationMetaDto = {
    currentPage: paginateParams.page,
    itemsPerPage: paginateParams.limit,
    totalItems: total,
    totalPages: Math.ceil(total / paginateParams.limit),
    itemCount: results.length,
  };

  return {
    data: results,
    meta: pagination,
  };
};
