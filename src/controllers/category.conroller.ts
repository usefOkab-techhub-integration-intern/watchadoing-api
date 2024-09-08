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
  } from '@loopback/rest';
  import { CategoryRepository } from '../repositories';
  
  export class WatchController {
    constructor(
      @repository(CategoryRepository)
      public categoryRepo : CategoryRepository,
    ) {}
  
    @post('/categories')
    @response(200, {
      description: 'Watch model instance',
      content: {'application/json': {schema: {'x-ts-type': Object}}},
    })
    async create(
      @requestBody({
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: {type: 'string'},
                description: {type: 'string'},
              },
            },
          },
        },
      })
      watchData: any,
    ): Promise<any> {
      return this.categoryRepo.create(watchData);
    }
  
    @get('/categories/{id}')
    @response(200, {
      description: 'Watch model instance',
      content: {'application/json': {schema: {'x-ts-type': Object}}},
    })
    async findById(@param.path.number('id') id: number): Promise<any> {
      return this.categoryRepo.findById(id);
    }
  
    @get('/categories')
    @response(200, {
      description: 'Array of Watch model instances',
      content: {'application/json': {schema: {'x-ts-type': Array}}},
    })
    async getAll(): Promise<any> {
      return this.categoryRepo.findAll();
    }
  
    @get('/categories/deleted')
    @response(200, {
      description: 'Array of Watch model instances',
      content: {'application/json': {schema: {'x-ts-type': Array}}},
    })
    async getDeleted(): Promise<any> {
      return this.categoryRepo.findDeleted();
    }
  
    @del('/categories/{id}')
    @response(204, {
      description: 'Watch DELETE success',
    })
    async deleteById(@param.path.number('id') id: number): Promise<void> {
      await this.categoryRepo.softDeleteById(id);
    }
  }