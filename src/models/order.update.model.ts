import { model, property } from '@loopback/repository';

@model()
export class OrderUpdate {
  @property({
    type: 'number',
    id: true,
    generated: true,
    required: true
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  customerId: number;

  constructor(data?: Partial<OrderUpdate>) {
    Object.assign(this, data);
  }
}