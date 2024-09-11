import {model, property} from '@loopback/repository';

@model()
export class WatchOrderShipmentFilter {
  @property({
    type: 'number',
    required: false,
  })
  orderId?: number;

  @property({
    type: 'string',
    required: false,
  })
  trackingNum?: string;

  @property({
    type: 'number',
    required: false,
  })
  customerId?: number;

  @property({
    type: 'string',
    required: false,
  })
  customerName?: string;

  @property({
    type: 'boolean',
    required: false,
  })
  isDone?: boolean;

  build(): any {
    return {
      ...(this.orderId && { orderId: this.orderId }),
      ...(this.customerId && { customerId: this.customerId }),
      ...(this.customerName && { customerName: this.customerName }),
      ...(this.isDone && { isDone: this.isDone })
    };
  }

  constructor(data?: Partial<WatchOrderShipmentFilter>) {
    Object.assign(this, data);
  }
}