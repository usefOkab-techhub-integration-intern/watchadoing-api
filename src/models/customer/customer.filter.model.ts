import { model, property } from '@loopback/repository';

@model()
export class CustomerFilter {

  @property({
    type: 'string'
  })
  name: string;

  constructor(data?: Partial<CustomerFilter>) {
    Object.assign(this, data);
  }
}