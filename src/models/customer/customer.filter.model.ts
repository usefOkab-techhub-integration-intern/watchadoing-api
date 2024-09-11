import { model, property } from '@loopback/repository';

@model()
export class CustomerFilter {

  @property({
    type: 'string'
  })
  name: string;

  build() : any {
    return {
      isDeleted: false,
      ...(this?.name && { name: { contains: this.name } }),
    };
  }

  constructor(data?: Partial<CustomerFilter>) {
    Object.assign(this, data);
  }
}