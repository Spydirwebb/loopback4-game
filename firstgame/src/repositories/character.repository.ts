import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Character, CharacterRelations, Armor} from '../models';
import {ArmorRepository} from './armor.repository';

export class CharacterRepository extends DefaultCrudRepository<
  Character,
  typeof Character.prototype.id,
  CharacterRelations
> {

  public readonly armor: HasOneRepositoryFactory<Armor, typeof Character.prototype.id>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('ArmorRepository') protected armorRepositoryGetter: Getter<ArmorRepository>,
  ) {
    super(Character, dataSource);
    this.armor = this.createHasOneRepositoryFactoryFor('armor', armorRepositoryGetter);
    this.registerInclusionResolver('armor', this.armor.inclusionResolver);
  }
}
