import { model, property } from '@loopback/repository';

@model()
export class OrderCreation {
  @property({
    type: 'number',
    required: true,
  })
  customerId: number;

  constructor(data?: Partial<OrderCreation>) {
    Object.assign(this, data);
  }
}