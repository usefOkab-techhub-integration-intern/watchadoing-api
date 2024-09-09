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

  @post('/watches')
  @response(200, {
    description: 'Watch model instance',
    content: {'application/json': {schema: {'x-ts-type': Watch}}},
  })
  async create(
    @requestBody({
      content: {'application/json': {schema: {'x-ts-type': Watch}}},  
    })
    watchData: any,
  ): Promise<any> {
    return this.watchRepo.create(watchData);
  }

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

  @patch('/watches/{id}')
  @response(200, {
    description: 'Watch model instance updated',
    content: {'application/json': {schema: {'x-ts-type': Watch}}},
  })
  async update(
    @param.path.number('id') id: number,
    @requestBody({
      content: {'application/json': {schema: {'x-ts-type': Watch}}},
    })
    watchData: any,
  ): Promise<any> {
    return this.watchRepo.updateById(id, watchData);
  }

  @del('/watches/{id}')
  @response(204, {
    description: 'Watch DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.watchRepo.softDeleteById(id);
  }
}