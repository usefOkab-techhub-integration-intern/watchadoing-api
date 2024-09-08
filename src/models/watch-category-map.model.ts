import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class WatchCategoryMap extends Entity {
  @property({
    type: 'number',
    required: true,
  })
  watchId: number;

  @property({
    type: 'number',
    required: true,
  })
  categoryId: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<WatchCategoryMap>) {
    super(data);
  }
}

export interface WatchCategoryMapRelations {
  // describe navigational properties here
}

export type WatchCategoryMapWithRelations = WatchCategoryMap & WatchCategoryMapRelations;
