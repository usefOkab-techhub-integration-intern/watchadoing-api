import {Entity, model, property, hasMany} from '@loopback/repository';
import {Watch, WatchWithRelations} from './watch.model';

@model({settings: {strict: false}})
export class Category extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  createdAt?: string;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  updatedAt?: string;

  @property({
    type: 'number',
  })
  watchId?: number;

  @hasMany(() => Watch)
  getWatches: Watch[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Category>) {
    super(data);
  }
}

export interface CategoryRelations {
  watches?: WatchWithRelations[];
}

export type CategoryWithRelations = Category & CategoryRelations;
