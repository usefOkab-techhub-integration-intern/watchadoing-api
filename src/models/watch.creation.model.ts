import {Entity, model, property} from '@loopback/repository';

@model()
export class WatchCreation extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  model: string;

  @property({
    type: 'string',
    required: true,
  })
  origin: string;

  @property({
    type: 'string',
    required: true,
  })
  sn: string;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

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

  constructor(data?: Partial<WatchCreation>) {
    super(data);
  }
}