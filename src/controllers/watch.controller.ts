import {
  repository,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  del,
  requestBody,
  response,
  patch
} from '@loopback/rest';
import { WatchCreation, WatchFilter, WatchUpdate } from '../models';
import { WatchRepository } from '../repositories';
import { PageSortParams } from '../models/paging.sorting.model';


export class WatchController {
  constructor(
    @repository(WatchRepository)
    public watchRepo : WatchRepository
  ) {}

  @get('/watches/{id}')
  @response(200, {
    description: 'Watch model instance',
    content: {'application/json': {schema: {'x-ts-type': WatchCreation}}},
  })
  async findById(@param.path.number('id') id: number): Promise<any> {
    return this.watchRepo.findById(id);
  }

  @get('/watches')
  @response(200, {
    description: 'Array of Watch model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: { 'x-ts-type': WatchCreation },
        },
      },
    },
  })
  async getFiltered(
    @param.query.object('pageSortParams')
    pageSortParams: PageSortParams,
  @param.query.object('filter')
    filter?: WatchFilter
  ): Promise<any> {
    return this.watchRepo.findFiltered(new PageSortParams(pageSortParams), new WatchFilter(filter));
  }

  @get('/watches/deleted')
  @response(200, {
    description: 'Array of Deleted Watch model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: { 'x-ts-type': WatchCreation },
        },
      },
    },
  })
  async getDeleted(
    @param.query.object('pageSortParams')
    pageSortParams: PageSortParams
  ): Promise<any[]> {
    return this.watchRepo.findDeleted(new PageSortParams(pageSortParams));
  }


  @post('/watches')
  @response(200, {
    description: 'Array of Watch model instances created',
    content: { 'application/json': { schema: { type: 'array', items: { 'x-ts-type': WatchCreation } } } },
  })
  async bulkCreate(
    @requestBody({
      content: { 'application/json': { schema: { type: 'array', items: { 'x-ts-type': WatchCreation } } } },
    })
    watches: WatchCreation[],
  ): Promise<any> {
    return this.watchRepo.bulkCreate(watches);
  }

  @patch('/watches')
@response(200, {
  description: 'Array of Watch model instances updated',
  content: {
    'application/json': {
      schema: { type: 'array', items: { 'x-ts-type': WatchUpdate } },
    },
  },
})
async bulkUpdate(
  @requestBody({
    content: {
      'application/json': {
        schema: { type: 'array', items: { 'x-ts-type': WatchUpdate } },
      },
    },
  })
  watches: WatchUpdate[],
): Promise<any[]> {
  return this.watchRepo.bulkUpdate(watches);
}

  @del('/watches')
  @response(204, {
    description: 'Bulk delete success',
  })
  async bulkDelete(
    @requestBody({
      content: { 'application/json': { schema: { type: 'array', items: { type: 'number' } } } },
    })
    ids: number[],
  ): Promise<void> {
    await this.watchRepo.bulkSoftDelete(ids);
  }
}