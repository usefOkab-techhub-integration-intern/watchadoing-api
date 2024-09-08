import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Watch} from '../models';
import {WatchRepository} from '../repositories';

export class WatchController {
  constructor(
    @repository(WatchRepository)
    public watchRepository : WatchRepository,
  ) {}

  @post('/watches')
  @response(200, {
    description: 'Watch model instance',
    content: {'application/json': {schema: getModelSchemaRef(Watch)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Watch, {
            title: 'NewWatch',
            exclude: ['id'],
          }),
        },
      },
    })
    watch: Omit<Watch, 'id'>,
  ): Promise<Watch> {
    return this.watchRepository.create(watch);
  }

  @get('/watches/count')
  @response(200, {
    description: 'Watch model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Watch) where?: Where<Watch>,
  ): Promise<Count> {
    return this.watchRepository.count(where);
  }

  @get('/watches')
  @response(200, {
    description: 'Array of Watch model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Watch, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Watch) filter?: Filter<Watch>,
  ): Promise<Watch[]> {
    return this.watchRepository.find(filter);
  }

  @patch('/watches')
  @response(200, {
    description: 'Watch PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Watch, {partial: true}),
        },
      },
    })
    watch: Watch,
    @param.where(Watch) where?: Where<Watch>,
  ): Promise<Count> {
    return this.watchRepository.updateAll(watch, where);
  }

  @get('/watches/{id}')
  @response(200, {
    description: 'Watch model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Watch, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Watch, {exclude: 'where'}) filter?: FilterExcludingWhere<Watch>
  ): Promise<Watch> {
    return this.watchRepository.findById(id, filter);
  }

  @patch('/watches/{id}')
  @response(204, {
    description: 'Watch PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Watch, {partial: true}),
        },
      },
    })
    watch: Watch,
  ): Promise<void> {
    await this.watchRepository.updateById(id, watch);
  }

  @put('/watches/{id}')
  @response(204, {
    description: 'Watch PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() watch: Watch,
  ): Promise<void> {
    await this.watchRepository.replaceById(id, watch);
  }

  @del('/watches/{id}')
  @response(204, {
    description: 'Watch DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    let watch : Watch = await this.watchRepository.findById(id);
    watch.isDeleted = true;
    await this.watchRepository.updateById(id,watch)
  }
}
