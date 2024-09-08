import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {WatchaDoingDbDataSource} from '../datasources';
import {Category, CategoryRelations, Watch} from '../models';
import {WatchRepository} from './watch.repository';

export class CategoryRepository extends DefaultCrudRepository<
  Category,
  typeof Category.prototype.id,
  CategoryRelations
> {

  public readonly getWatches: HasManyRepositoryFactory<Watch, typeof Category.prototype.id>;

  public readonly watches: HasManyRepositoryFactory<Watch, typeof Category.prototype.id>;

  public readonly watch: BelongsToAccessor<Watch, typeof Category.prototype.id>;

  constructor(
    @inject('datasources.WatchaDoingDB') dataSource: WatchaDoingDbDataSource, @repository.getter('WatchRepository') protected watchRepositoryGetter: Getter<WatchRepository>,
  ) {
    super(Category, dataSource);
    this.watch = this.createBelongsToAccessorFor('watch', watchRepositoryGetter,);
    this.registerInclusionResolver('watch', this.watch.inclusionResolver);
    this.watches = this.createHasManyRepositoryFactoryFor('watches', watchRepositoryGetter,);
    this.registerInclusionResolver('watches', this.watches.inclusionResolver);
    this.getWatches = this.createHasManyRepositoryFactoryFor('watches', watchRepositoryGetter,);
    this.registerInclusionResolver('watches', this.getWatches.inclusionResolver);
  }
}
