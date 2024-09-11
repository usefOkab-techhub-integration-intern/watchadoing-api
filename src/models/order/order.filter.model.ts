import { model, property } from '@loopback/repository';

@model()
export class WatchOrderFilter {
  @property({
    type: 'number'
  })
  customerId: number;

  @property({
    type: 'string'
  })
  customerName: string;

  constructor(data?: Partial<WatchOrderFilter>) {
    Object.assign(this, data);
  }
}