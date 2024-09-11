  import {model, property} from '@loopback/repository';

  @model()
  export class WatchOrderLineFilter {
    @property({
      type: 'number',
      required: false,
    })
    orderId?: number;

    @property({
      type: 'number',
      required: false,
    })
    watchId?: number;

    @property({
      type: 'number',
      required: false,
    })
    quantity?: number;

    @property({
      type: 'string',
      required: false,
    })
    watchModel?: string;

    @property({
      type: 'string',
      required: false,
    })
    watchOrigin?: string;

    @property({
      type: 'string',
      required: false,
    })
    watchSN?: string;

    @property({
      type: 'number',
      required: false,
    })
    watchCategoryId?: number;

    @property({
      type: 'string',
      required: false,
    })
    watchCategoryName?: string;

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

    build(): any {
      return {
        ...(this.orderId && { orderId: this.orderId }),
        ...(this.customerId && { customerId: this.customerId }),
        ...(this.customerName && { customerName: this.customerName }),
        ...(this.watchId && { watchId: this.watchId }),
        ...(this.quantity && { quantity: this.quantity }),
        ...(this.watchModel && { watch: { model: { contains: this.watchModel } } }),
        ...(this.watchOrigin && { watch: { origin: { contains: this.watchOrigin } } }),
        ...(this.watchSN && { watch: { serialNumber: { contains: this.watchSN } } }),
        ...(this.watchCategoryName && {
          watch: {
            categories: {
              some: {
                name: { contains: this.watchCategoryName },
              },
            },
          },
        }),
      };
    }

    constructor(data?: Partial<WatchOrderLineFilter>) {
      Object.assign(this, data);
    }
  }