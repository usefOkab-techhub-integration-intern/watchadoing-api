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
import { OrderShipmentRepository } from '../repositories';
import { OrderShipmentCreation, OrderShipmentFilter, OrderShipmentUpdate } from '../models';
import { PageSortParams } from '../models/paging.sorting.model';

export class OrderShipmentController {
  constructor(
    @repository(OrderShipmentRepository)
    public orderShipmentRepo: OrderShipmentRepository
  ) {}

  @get('/shipments/{id}')
  @response(200, {
    description: 'OrderShipment model instance',
    content: { 'application/json': { schema: { 'x-ts-type': OrderShipmentCreation } } },
  })
  async findById(@param.path.number('id') id: number): Promise<any> {
    return this.orderShipmentRepo.findById(id);
  }

  @get('/shipments')
  @response(200, {
    description: 'Array of OrderShipment model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: { 'x-ts-type': OrderShipmentCreation },
        },
      },
    },
  })
  async getAll(
    @param.query.object('pageSortParams')
    pageSortParams: PageSortParams,
    @param.query.object('filter')
    filter?: OrderShipmentFilter
  ): Promise<any> {
    return this.orderShipmentRepo.findFiltered(new PageSortParams(pageSortParams), new OrderShipmentFilter(filter));
  }

  @post('/shipments')
  @response(200, {
    description: 'Array of OrderShipment model instances created',
    content: {
      'application/json': {
        schema: { type: 'array', items: { 'x-ts-type': OrderShipmentCreation } },
      },
    },
  })
  async bulkCreate(
    @requestBody({
      content: {
        'application/json': {
          schema: { type: 'array', items: { 'x-ts-type': OrderShipmentCreation } },
        },
      },
    })
    shipments: OrderShipmentCreation[],
  ): Promise<any[]> {
    return this.orderShipmentRepo.bulkCreate(shipments);
  }

  @patch('/shipments')
  @response(200, {
    description: 'Array of OrderShipment model instances updated',
    content: {
      'application/json': {
        schema: { type: 'array', items: { 'x-ts-type': OrderShipmentUpdate } },
      },
    },
  })
  async bulkUpdate(
    @requestBody({
      content: {
        'application/json': {
          schema: { type: 'array', items: { 'x-ts-type': OrderShipmentUpdate } },
        },
      },
    })
    shipments: OrderShipmentUpdate[],
  ): Promise<any[]> {
    return this.orderShipmentRepo.bulkUpdate(shipments);
  }

  @del('/shipments')
  @response(204, {
    description: 'Bulk delete success',
  })
  async bulkDelete(
    @requestBody({
      content: { 'application/json': { schema: { type: 'array', items: { type: 'number' } } } },
    })
    ids: number[],
  ): Promise<void> {
    await this.orderShipmentRepo.bulkDelete(ids);
  }
}