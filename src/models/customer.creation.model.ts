import { model, property } from '@loopback/repository';

@model()
export class CustomerCreation {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
    default: () => new Date().toISOString(),
  })
  addedAt?: string;

  @property({
    type: 'string',
    required: true,
    default: () => new Date().toISOString(),
  })
  updatedAt?: string;

  @property({
    type: 'array',
    itemType: 'number',
  })
  orders?: number[];

  constructor(data?: Partial<CustomerCreation>) {
    Object.assign(this, data);
  }
}