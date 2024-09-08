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
import { WatchRepository, CategoryRepository } from '../repositories';

export class WatchController {
  constructor(
    @repository(WatchRepository)
    public watchRepo : WatchRepository
  ) {}

  @post('/watches')
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
              model: {type: 'string'},
              origin: {type: 'string'},
              sn: {type: 'string'},
              price: {type: 'number'},
              quantity: {type: 'number'},
            },
          },
        },
      },
    })
    watchData: any,
  ): Promise<any> {
    return this.watchRepo.create(watchData);
  }

  @get('/watches/{id}')
  @response(200, {
    description: 'Watch model instance',
    content: {'application/json': {schema: {'x-ts-type': Object}}},
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

  @del('/watches/{id}')
  @response(204, {
    description: 'Watch DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.watchRepo.softDeleteById(id);
  }
}