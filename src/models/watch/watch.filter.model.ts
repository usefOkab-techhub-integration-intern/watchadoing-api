import {Entity, model, property} from '@loopback/repository';

@model()
export class WatchFilter extends Entity {
  @property({
    type: 'string'
  })
  model: string;

  @property({
    type: 'string'
  })
  origin: string;

  @property({
    type: 'string'
  })
  sn: string;

  @property({
    type: 'number'
  })
  price: number;

  @property({
    type: 'number',
    default: 0,
  })
  quantity?: number;

  @property({
    type: 'array',
    itemType: 'number',
  })
  categories?: number[];
  
  build() : any {
    return {
      isDeleted: false,
      ...(this?.model && { model: { contains: this.model } }),
      ...(this?.origin && { origin: { contains: this.origin } }),
      ...(this?.sn && { sn: { contains: this.sn } }),
      ...(this?.categories && { 
        categories: {
          some: {
            id: this.categories,
            isDeleted: false,
          }
        }
      }),
    };
  }
  constructor(data?: Partial<WatchFilter>) {
    super(data);
  }
}