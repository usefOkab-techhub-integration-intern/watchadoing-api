import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {WatchaDoingDbDataSource} from '../datasources';
import {Category, CategoryRelations, Watch} from '../models';
import {WatchRepository} from './watch.repository';

export class CategoryRepository extends DefaultCrudRepository<
  Category,
  typeof Category.prototype.id,
  CategoryRelations
> {

  public readonly getWatches: HasManyRepositoryFactory<Watch, typeof Category.prototype.id>;

  constructor(
    @inject('datasources.WatchaDoingDB') dataSource: WatchaDoingDbDataSource, @repository.getter('WatchRepository') protected watchRepositoryGetter: Getter<WatchRepository>,
  ) {
    super(Category, dataSource);
    this.getWatches = this.createHasManyRepositoryFactoryFor('getWatches', watchRepositoryGetter,);
  }
}
