import {Entity, model, property} from '@loopback/repository';

@model()
export class WatchUpdate extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string'
  })
  model?: string;

  @property({
    type: 'string'
  })
  origin?: string;

  @property({
    type: 'string'
  })
  sn?: string;

  @property({
    type: 'number'
  })
  price?: number;

  @property({
    type: 'number',
    default: 0,
  })
  quantity?: number;

  @property({
    type: 'array',
    itemType: 'number',
  })
  categories?: number[];

  constructor(data?: Partial<WatchUpdate>) {
    super(data);
  }
}