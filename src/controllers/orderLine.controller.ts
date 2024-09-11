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
  patch,
} from '@loopback/rest';
import { WatchOrderLineRepository } from '../repositories';
import { WatchOrderLineCreation, WatchOrderLineFilter, WatchOrderLineUpdate } from '../models';

export class WatchOrderLineController {
  constructor(
    @repository(WatchOrderLineRepository)
    public watchOrderLineRepo: WatchOrderLineRepository
  ) {}

  @get('/orderLines/{id}')
  @response(200, {
    description: 'WatchOrderLine model instance',
    content: { 'application/json': { schema: { 'x-ts-type': WatchOrderLineCreation } } },
  })
  async findById(@param.path.number('id') id: number): Promise<any> {
    return this.watchOrderLineRepo.findById(id);
  }

  @get('/orderLines')
  @response(200, {
    description: 'Array of WatchOrderLine model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: { 'x-ts-type': WatchOrderLineCreation },
        },
      },
    },
  })
  async getAll(
    @param.query.number('page', { default: 1 }) page: number,
    @param.query.number('pageSize', { default: 10 }) pageSize: number,
    @param.query.string('sortBy', { default: 'createdAt' }) sortBy: string,
    @param.query.string('sortOrder', { default: 'desc' }) sortOrder: 'asc' | 'desc',
    @param.query.object('filter') filter?: WatchOrderLineFilter
  ): Promise<any> {
    return this.watchOrderLineRepo.findFiltered(page, pageSize, sortBy, sortOrder, filter);
  }

  @post('/orderLines')
  @response(200, {
    description: 'Array of WatchOrderLine model instances created',
    content: {
      'application/json': {
        schema: { type: 'array', items: { 'x-ts-type': WatchOrderLineCreation } },
      },
    },
  })
  async bulkCreate(
    @requestBody({
      content: {
        'application/json': {
          schema: { type: 'array', items: { 'x-ts-type': WatchOrderLineCreation } },
        },
      },
    })
    orderLines: WatchOrderLineCreation[],
  ): Promise<any[]> {
    return this.watchOrderLineRepo.bulkCreate(orderLines);
  }

  @patch('/orderLines')
  @response(200, {
    description: 'Array of WatchOrderLine model instances updated',
    content: {
      'application/json': {
        schema: { type: 'array', items: { 'x-ts-type': WatchOrderLineUpdate } },
      },
    },
  })
  async bulkUpdate(
    @requestBody({
      content: {
        'application/json': {
          schema: { type: 'array', items: { 'x-ts-type': WatchOrderLineUpdate } },
        },
      },
    })
    orderLines: WatchOrderLineUpdate[],
  ): Promise<any[]> {
    return this.watchOrderLineRepo.bulkUpdate(orderLines);
  }

  @del('/orderLines')
  @response(204, {
    description: 'Bulk delete success',
  })
  async bulkDelete(
    @requestBody({
      content: { 'application/json': { schema: { type: 'array', items: { type: 'number' } } } },
    })
    ids: number[],
  ): Promise<void> {
    await this.watchOrderLineRepo.bulkDelete(ids);
  }
}