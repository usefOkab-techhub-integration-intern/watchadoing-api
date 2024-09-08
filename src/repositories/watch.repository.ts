import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {WatchaDoingDbDataSource} from '../datasources';
import {Watch, WatchRelations, Category} from '../models';
import {CategoryRepository} from './category.repository';

export class WatchRepository extends DefaultCrudRepository<
  Watch,
  typeof Watch.prototype.id,
  WatchRelations
> {

  public readonly getCategories: HasManyRepositoryFactory<Category, typeof Watch.prototype.id>;

  constructor(
    @inject('datasources.WatchaDoingDB') dataSource: WatchaDoingDbDataSource, @repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>,
  ) {
    super(Watch, dataSource);
    this.getCategories = this.createHasManyRepositoryFactoryFor('getCategories', categoryRepositoryGetter,);
    this.registerInclusionResolver('getCategories', this.getCategories.inclusionResolver);
  }
}
