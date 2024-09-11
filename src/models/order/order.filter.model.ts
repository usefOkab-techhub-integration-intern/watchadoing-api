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

  build() : any {
    return {
      ...(this?.customerId && { customerId: this.customerId }),
      ...(this?.customerName && {
        customer: {
          name: {
            contains: this.customerName,
          },
        },
      }),
    };
  }

  constructor(data?: Partial<WatchOrderFilter>) {
    Object.assign(this, data);
  }
}