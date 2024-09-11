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
import { CategoryRepository } from '../repositories';
import { CategoryCreation } from '../models';
import { CategoryUpdate } from '../models';

export class CategoryController {
  constructor(
    @repository(CategoryRepository)
    public categoryRepo : CategoryRepository
  ) {}

  @get('/categories/{id}')
  @response(200, {
    description: 'Category model instance',
    content: {'application/json': {schema: {'x-ts-type': CategoryCreation}}},
  })
  async findById(@param.path.number('id') id: number): Promise<any> {
    return this.categoryRepo.findById(id);
  }

  @get('/categories')
  @response(200, {
    description: 'Array of Watch model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: { 'x-ts-type': CategoryCreation },
        },
      },
    },
  })
  async getAll(
  @param.query.number('page', { default: 1 }) page: number,
  @param.query.number('pageSize', { default: 10 }) pageSize: number,
  @param.query.string('sortBy', { default: 'addedAt' }) sortBy: string,
  @param.query.string('sortOrder', { default: 'desc' }) sortOrder: 'asc' | 'desc'
  ): Promise<any>  {
    return this.categoryRepo.findAll(page,pageSize,sortBy,sortOrder);
  }

  @get('/categories/deleted')
  @response(200, {
    description: 'Array of Watch model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: { 'x-ts-type': CategoryCreation },
        },
      },
    },
  })
  async getDeleted(
  @param.query.number('page', { default: 1 }) page: number,
  @param.query.number('pageSize', { default: 10 }) pageSize: number,
  @param.query.string('sortBy', { default: 'addedAt' }) sortBy: string,
  @param.query.string('sortOrder', { default: 'desc' }) sortOrder: 'asc' | 'desc'
  ): Promise<any> {
    return this.categoryRepo.findDeleted(page,pageSize,sortBy,sortOrder);
  }


  @post('/categories')
  @response(200, {
    description: 'Array of Category model instances created',
    content: { 'application/json': { schema: { type: 'array', items: { 'x-ts-type': CategoryCreation } } } },
  })
  async bulkCreate(
    @requestBody({
      content: { 'application/json': { schema: { type: 'array', items: { 'x-ts-type': CategoryCreation } } } },
    })
    categories: CategoryCreation[],
  ): Promise<any[]> {
    return this.categoryRepo.bulkCreate(categories);
  }

  @patch('/categories')
@response(200, {
  description: 'Array of Category model instances updated',
  content: {
    'application/json': {
      schema: { type: 'array', items: { 'x-ts-type': CategoryCreation } },
    },
  },
})
async bulkUpdate(
  @requestBody({
    content: {
      'application/json': {
        schema: { type: 'array', items: { 'x-ts-type': CategoryUpdate } },
      },
    },
  })
  categories: any[],
): Promise<any[]> {
  return this.categoryRepo.bulkUpdate(categories);
}

  @del('/categories')
  @response(204, {
    description: 'Bulk delete success',
  })
  async bulkDelete(
    @requestBody({
      content: { 'application/json': { schema: { type: 'array', items: { type: 'number' } } } },
    })
    ids: number[],
  ): Promise<void> {
    await this.categoryRepo.bulkSoftDelete(ids);
  }
}