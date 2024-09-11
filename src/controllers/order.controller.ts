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
import { OrderCreation, OrderUpdate } from '../models';

export class OrderController {
  constructor(
    @repository(OrderRepository)
    public orderRepo: OrderRepository
  ) {}

  @get('/orders/{id}')
  @response(200, {
    description: 'Order model instance',
    content: {'application/json': {schema: {'x-ts-type': OrderCreation}}},
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
          items: { 'x-ts-type': OrderCreation },
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
    filter?: { orderId?: number; name?: string; },
  ): Promise<any> {
    return this.orderRepo.findFiltered(page, pageSize, sortBy, sortOrder, filter);
  }

  @post('/orders')
  @response(200, {
    description: 'Array of Order model instances created',
    content: { 
      'application/json': { 
        schema: { type: 'array', items: { 'x-ts-type': OrderCreation } } 
      } 
    },
  })
  async bulkCreate(
    @requestBody({
      content: { 
        'application/json': { 
          schema: { type: 'array', items: { 'x-ts-type': OrderCreation } } 
        } 
      },
    })
    orders: { name: string }[],
  ): Promise<any[]> {
    return this.orderRepo.bulkCreate(orders);
  }

  @patch('/orders')
  @response(200, {
    description: 'Array of Order model instances updated',
    content: {
      'application/json': {
        schema: { type: 'array', items: { 'x-ts-type': OrderUpdate } },
      },
    },
  })
  async bulkUpdate(
    @requestBody({
      content: {
        'application/json': {
          schema: { type: 'array', items: { 'x-ts-type': OrderUpdate } },
        },
      },
    })
    orders: { id: number, name: string }[],
  ): Promise<any[]> {
    return this.orderRepo.bulkUpdate(orders);
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