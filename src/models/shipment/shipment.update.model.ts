import {Entity, model, property} from '@loopback/repository';

@model()
export class OrderShipmentUpdate extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
    required: true,
  })
  id: number;
  
  @property({
    type: 'boolean',
    required: true,
    default: false
  })
  isDone: boolean;

  constructor(data?: Partial<OrderShipmentUpdate>) {
    super(data);
  }
}