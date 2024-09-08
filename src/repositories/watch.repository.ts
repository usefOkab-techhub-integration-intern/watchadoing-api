import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, juggler} from '@loopback/repository';
import {WatchaDoingDbDataSource} from '../datasources';
import {Watch, WatchRelations, Category} from '../models';
import {CategoryRepository, } from './category.repository';


export class WatchRepository extends DefaultCrudRepository<
  Watch,
  typeof Watch.prototype.id,
  WatchRelations
> {

  public readonly getCategories: HasManyRepositoryFactory<Category, typeof Watch.prototype.id>;

  public readonly categories: HasManyRepositoryFactory<Category, typeof Watch.prototype.id>;

  constructor(
    @inject('datasources.WatchaDoingDB') dataSource: WatchaDoingDbDataSource, @repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>,
  ) {
    super(Watch, dataSource);
    this.categories = this.createHasManyRepositoryFactoryFor('categories', categoryRepositoryGetter,);
    this.registerInclusionResolver('categories', this.categories.inclusionResolver);
    this.getCategories = this.createHasManyRepositoryFactoryFor('categories', categoryRepositoryGetter,);
    this.registerInclusionResolver('categories', this.getCategories.inclusionResolver);
  }
}
