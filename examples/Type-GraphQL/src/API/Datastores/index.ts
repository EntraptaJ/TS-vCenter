import { Resolver, Query } from 'type-graphql';
import { loginvCSA } from '../../auth';
import { Datastores } from 'ts-vcenter';
import { DataStoresType } from './DataStoreType';

@Resolver()
export default class DataStoreResolver {
  @Query(returns => [DataStoresType])
  public async DataStores(): Promise<Datastores[]> {
    const vcsa = await loginvCSA();
    return vcsa.getDataStores();
  }
}
