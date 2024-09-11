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
import { PageSortParams } from '../models/paging.sorting.model';

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
    description: 'Array of Category model instances',
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
  @param.query.object('pageSortParams')
  pageSortParams: PageSortParams
  ): Promise<any>  {
    return this.categoryRepo.findAll(new PageSortParams(pageSortParams));
  }

  @get('/categories/deleted')
  @response(200, {
    description: 'Array of Category model instances',
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
    @param.query.object('pageSortParams')
    pageSortParams: PageSortParams
  ): Promise<any> {
    return this.categoryRepo.findDeleted(new PageSortParams(pageSortParams));
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
  categories: CategoryUpdate[],
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