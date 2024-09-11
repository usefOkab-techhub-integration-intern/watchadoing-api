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
import { OrderRepository } from '../repositories';
import { WatchOrderCreation } from '../models';
import { WatchOrderFilter } from '../models/order/order.filter.model';

export class OrderController {
  constructor(
    @repository(OrderRepository)
    public orderRepo: OrderRepository
  ) {}

  @get('/orders/{id}')
  @response(200, {
    description: 'Order model instance',
    content: {'application/json': {schema: {'x-ts-type': WatchOrderCreation}}},
  })
  async findById(@param.path.number('id') id: number): Promise<any> {
    return this.orderRepo.findById(id);
  }

  @get('/orders')
  @response(200, {
    description: 'Array of Order model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: { 'x-ts-type': WatchOrderCreation },
        },
      },
    },
  })
  async getAll(
    @param.query.number('page', { default: 1 }) page: number,
    @param.query.number('pageSize', { default: 10 }) pageSize: number,
    @param.query.string('sortBy', { default: 'createdAt' }) sortBy: string,
    @param.query.string('sortOrder', { default: 'desc' }) sortOrder: 'asc' | 'desc',
    @param.query.object('filter')
    filter?: WatchOrderFilter,
  ): Promise<any> {
    return this.orderRepo.findFiltered(page, pageSize, sortBy, sortOrder, filter);
  }

  @post('/orders')
  @response(200, {
    description: 'Array of Order model instances created',
    content: { 
      'application/json': { 
        schema: { type: 'array', items: { 'x-ts-type': WatchOrderCreation } } 
      } 
    },
  })
  async bulkCreate(
    @requestBody({
      content: { 
        'application/json': { 
          schema: { type: 'array', items: { 'x-ts-type': WatchOrderCreation } } 
        } 
      },
    })
    orders: WatchOrderCreation[],
  ): Promise<any[]> {
    return this.orderRepo.bulkCreate(orders);
  }

  @del('/orders')
  @response(204, {
    description: 'Bulk delete success',
  })
  async bulkDelete(
    @requestBody({
      content: { 'application/json': { schema: { type: 'array', items: { type: 'number' } } } },
    })
    ids: number[],
  ): Promise<void> {
    await this.orderRepo.bulkDelete(ids);
  }
}