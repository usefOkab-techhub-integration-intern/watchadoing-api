import {Entity, model, property} from '@loopback/repository';

@model()
export class WatchOrderLineCreation extends Entity {
  @property({
    type: 'number',
    required: true,
  })
  watchId: number;

  @property({
    type: 'number',
    required: true,
  })
  orderId: number;

  @property({
    type: 'number',
    required: true,
    default: 1
  })
  quantity: number;

  constructor(data?: Partial<WatchOrderLineCreation>) {
    super(data);
  }
}