import {Entity, model, property} from '@loopback/repository';

@model()
export class PageSortParams extends Entity {
  @property({
    type: 'number',
    default: 1,
  })
  page: number;

  @property({
    type: 'number',
    default: 5,
  })
  pageSize: number;

  @property({
    type: 'string',
    default: 'createdAt',
  })
  sortBy: string;

  @property({
    type: 'string',
    default: 'desc',
  })
  sortOrder: 'asc' | 'desc';

  constructor(data?: Partial<PageSortParams>) {
    super(Object.assign({
      page: 1,
      pageSize: 5,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    }, data));
  }
}