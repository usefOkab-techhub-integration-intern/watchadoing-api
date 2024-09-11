import {Entity, model, property} from '@loopback/repository';

@model()
export class CategoryFilter extends Entity {

  constructor(data?: Partial<CategoryFilter>) {
    super(data);
  }
}