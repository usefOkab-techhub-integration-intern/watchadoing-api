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
import { Watch } from '../models/watch.model';

export class WatchController {
  constructor(
    @repository(WatchRepository)
    public watchRepo : WatchRepository
  ) {}

  @get('/watches/{id}')
  @response(200, {
    description: 'Watch model instance',
    content: {'application/json': {schema: {'x-ts-type': Watch}}},
  })
  async findById(@param.path.number('id') id: number): Promise<any> {
    return this.watchRepo.findById(id);
  }

  @get('/watches')
  @response(200, {
    description: 'Array of Watch model instances',
    content: {'application/json': {schema: {'x-ts-type': Array}}},
  })
  async getAll(): Promise<any> {
    return this.watchRepo.findAll();
  }

  @get('/watches/deleted')
  @response(200, {
    description: 'Array of Watch model instances',
    content: {'application/json': {schema: {'x-ts-type': Array}}},
  })
  async getDeleted(): Promise<any> {
    return this.watchRepo.findDeleted();
  }


  @post('/watches')
  @response(200, {
    description: 'Array of Watch model instances created',
    content: { 'application/json': { schema: { type: 'array', items: { 'x-ts-type': Watch } } } },
  })
  async bulkCreate(
    @requestBody({
      content: { 'application/json': { schema: { type: 'array', items: { 'x-ts-type': Watch } } } },
    })
    watches: Watch[],
  ): Promise<any> {
    return this.watchRepo.bulkCreate(watches);
  }

  @patch('/watches')
@response(200, {
  description: 'Array of Watch model instances updated',
  content: {
    'application/json': {
      schema: { type: 'array', items: { 'x-ts-type': Watch } },
    },
  },
})
async bulkUpdate(
  @requestBody({
    content: {
      'application/json': {
        schema: { type: 'array', items: { 'x-ts-type': Watch } },
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