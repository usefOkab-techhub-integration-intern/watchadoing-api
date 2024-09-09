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
import { Category } from '../models/category.model';

export class CategoryController {
  constructor(
    @repository(CategoryRepository)
    public categoryRepo : CategoryRepository
  ) {}

  @get('/categories/{id}')
  @response(200, {
    description: 'Category model instance',
    content: {'application/json': {schema: {'x-ts-type': Category}}},
  })
  async findById(@param.path.number('id') id: number): Promise<any> {
    return this.categoryRepo.findById(id);
  }

  @get('/categories')
  @response(200, {
    description: 'Array of Category model instances',
    content: {'application/json': {schema: {'x-ts-type': Array}}},
  })
  async getAll(): Promise<any> {
    return this.categoryRepo.findAll();
  }

  @get('/categories/deleted')
  @response(200, {
    description: 'Array of Category model instances',
    content: {'application/json': {schema: {'x-ts-type': Array}}},
  })
  async getDeleted(): Promise<any> {
    return this.categoryRepo.findDeleted();
  }


  @post('/categories')
  @response(200, {
    description: 'Array of Category model instances created',
    content: { 'application/json': { schema: { type: 'array', items: { 'x-ts-type': Category } } } },
  })
  async bulkCreate(
    @requestBody({
      content: { 'application/json': { schema: { type: 'array', items: { 'x-ts-type': Category } } } },
    })
    categories: Category[],
  ): Promise<any> {
    return this.categoryRepo.bulkCreate(categories);
  }

  @patch('/categories')
@response(200, {
  description: 'Array of Category model instances updated',
  content: {
    'application/json': {
      schema: { type: 'array', items: { 'x-ts-type': Category } },
    },
  },
})
async bulkUpdate(
  @requestBody({
    content: {
      'application/json': {
        schema: { type: 'array', items: { 'x-ts-type': Category } },
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