import {Entity, model, property, hasMany} from '@loopback/repository';
import {Category, CategoryWithRelations} from './category.model';

@model({settings: {strict: false}})
export class Watch extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  model: string;

  @property({
    type: 'string',
    required: true,
  })
  origin: string;

  @property({
    type: 'string',
    required: true,
  })
  sn: string;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  @property({
    type: 'number',
    required: true,
  })
  quantity: number;

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

  @hasMany(() => Category)
  getCategories: Category[];

  @property({
    type: 'number',
  })
  categoryId?: number;
  [prop: string]: any;

  constructor(data?: Partial<Watch>) {
    super(data);
  }
}

export interface WatchRelations {
  categories?: CategoryWithRelations[];
}

export type WatchWithRelations = Watch & WatchRelations;
