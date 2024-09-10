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
import { WatchRepository } from '../repositories';
import { WatchCreation } from '../models/watch.creation.model';
import { WatchUpdate } from '../models/watch.update.model';


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
    content: { 'application/json': { schema: { 'x-ts-type': Array } } },
  })
  async getFiltered(
    @param.query.object('filter')
    filter?: { model?: string; origin?: string; sn?: string; category?: number },
  ): Promise<any> {
    return this.watchRepo.findFiltered(filter)
  }

  @get('/watches/deleted')
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
  async getDeleted(
    @param.query.number('page', { default: 1 }) page: number,
    @param.query.number('pageSize', { default: 10 }) pageSize: number,
    @param.query.string('sortBy', { default: 'createdAt' }) sortBy: string,
    @param.query.string('sortOrder', { default: 'desc' }) sortOrder: 'asc' | 'desc',
  ): Promise<any[]> {
    return this.watchRepo.findDeleted(page, pageSize, sortBy, sortOrder);
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
  watches: any[],
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