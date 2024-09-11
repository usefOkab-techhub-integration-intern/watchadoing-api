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
import { CustomerRepository } from '../repositories';
import { CustomerCreation, CustomerUpdate } from '../models';
import { CustomerFilter } from '../models/customer/customer.filter.model';
import { PageSortParams } from '../models/paging.sorting.model';
  
  export class CustomerController {
    constructor(
      @repository(CustomerRepository)
      public customerRepo: CustomerRepository
    ) {}
  
    @get('/customers/{id}')
    @response(200, {
      description: 'Customer model instance',
      content: {'application/json': {schema: {'x-ts-type': CustomerCreation}}},
    })
    async findById(@param.path.number('id') id: number): Promise<any> {
      return this.customerRepo.findById(id);
    }
  
    @get('/customers')
    @response(200, {
      description: 'Array of Customer model instances',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: { 'x-ts-type': CustomerCreation },
          },
        },
      },
    })
    async getAll(
      @param.query.object('pageSortParams')
      pageSortParams: PageSortParams,
      @param.query.object('filter')
      filter?: CustomerFilter
    ): Promise<any> {
      return this.customerRepo.findFiltered(new PageSortParams(pageSortParams), filter);
    }
  
    @get('/customers/deleted')
    @response(200, {
      description: 'Array of deleted Customer model instances',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: { 'x-ts-type': CustomerCreation },
          },
        },
      },
    })
    async getDeleted(
      @param.query.object('pageSortParams')
      pageSortParams: PageSortParams
    ): Promise<any> {
      return this.customerRepo.findDeleted(new PageSortParams(pageSortParams));
    }

    @post('/customers')
    @response(200, {
      description: 'Array of Customer model instances created',
      content: { 
        'application/json': { 
          schema: { type: 'array', items: { 'x-ts-type': CustomerCreation } } 
        } 
      },
    })
    async bulkCreate(
      @requestBody({
        content: { 
          'application/json': { 
            schema: { type: 'array', items: { 'x-ts-type': CustomerCreation } } 
          } 
        },
      })
      customers: CustomerCreation[],
    ): Promise<any[]> {
      return this.customerRepo.bulkCreate(customers);
    }

  @patch('/customers')
  @response(200, {
    description: 'Array of Customer model instances updated',
    content: {
      'application/json': {
        schema: { type: 'array', items: { 'x-ts-type': CustomerUpdate } },
      },
    },
  })
  async bulkUpdate(
    @requestBody({
      content: {
        'application/json': {
          schema: { type: 'array', items: { 'x-ts-type': CustomerUpdate } },
        },
      },
    })
    customers: CustomerUpdate[],
  ): Promise<any[]> {
    return this.customerRepo.bulkUpdate(customers);
  }

  
    @del('/customers')
    @response(204, {
      description: 'Bulk delete success',
    })
    async bulkDelete(
      @requestBody({
        content: { 'application/json': { schema: { type: 'array', items: { type: 'number' } } } },
      })
      ids: number[],
    ): Promise<void> {
      await this.customerRepo.bulkSoftDelete(ids);
    }
  }