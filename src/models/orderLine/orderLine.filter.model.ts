import {model, property} from '@loopback/repository';

@model()
export class WatchOrderLineFilter {
  @property({
    type: 'number',
    required: false,
  })
  orderId?: number;

  @property({
    type: 'number',
    required: false,
  })
  watchId?: number;

  @property({
    type: 'number',
    required: false,
  })
  quantity?: number;

  @property({
    type: 'string',
    required: false,
  })
  watchModel?: string;

  @property({
    type: 'string',
    required: false,
  })
  watchOrigin?: string;

  @property({
    type: 'string',
    required: false,
  })
  watchSN?: string;

  @property({
    type: 'number',
    required: false,
  })
  watchCategoryId?: number;

  @property({
    type: 'string',
    required: false,
  })
  watchCategoryName?: string;
}