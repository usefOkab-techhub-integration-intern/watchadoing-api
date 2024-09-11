import {Entity, model, property} from '@loopback/repository';

@model()
export class CategoryCreation extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string'
  })
  description?: string;

  constructor(data?: Partial<CategoryCreation>) {
    super(data);
  }
}