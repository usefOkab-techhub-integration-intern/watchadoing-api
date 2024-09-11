import {Entity, model, property} from '@loopback/repository';

@model()
export class WatchOrderLineUpdate extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;
  
  @property({
    type: 'number',
    required: true,
    default: 1
  })
  quantity: number;

  constructor(data?: Partial<WatchOrderLineUpdate>) {
    super(data);
  }
}