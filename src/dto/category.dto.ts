export interface CategoryI{
  id         : number,
  name      : string,
  description     : string,
  createdAt  : Date,
  updatedAt  : Date,
}

export class CategoryDTO {

    constructor() {}

    mapArray(categories: any[]): CategoryI[] {
      return categories.map(category => this.map(category));
    }

    map(category: any): CategoryI {
      return {
        id: category.id,
        name: category.name,
        description: category.decription,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      };
    }
  }