import {Entity, model, property} from '@loopback/repository';

@model()
export class OrderShipmentCreation extends Entity {
  @property({
    type: 'number',
    required: true,
  })
  orderId: number;

  @property({
    type: 'string',
    required: true,
  })
  trackingNum: string;

  constructor(data?: Partial<OrderShipmentCreation>) {
    super(data);
  }
}