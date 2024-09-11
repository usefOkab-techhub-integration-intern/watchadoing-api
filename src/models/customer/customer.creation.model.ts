import { model, property } from '@loopback/repository';

@model()
export class CustomerCreation {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  constructor(data?: Partial<CustomerCreation>) {
    Object.assign(this, data);
  }
}