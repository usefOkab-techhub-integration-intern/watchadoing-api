import { model, property } from '@loopback/repository';

@model()
export class CustomerUpdate {
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
  name: string;

  constructor(data?: Partial<CustomerUpdate>) {
    Object.assign(this, data);
  }
}