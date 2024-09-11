import { model, property } from '@loopback/repository';

@model()
export class WatchOrderCreation {
  @property({
    type: 'number',
    required: true,
  })
  customerId: number;

  constructor(data?: Partial<WatchOrderCreation>) {
    Object.assign(this, data);
  }
}