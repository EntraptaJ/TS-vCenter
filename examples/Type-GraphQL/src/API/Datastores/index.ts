import { Resolver, Query } from 'type-graphql';
import { loginVCSA, vCenter, Datastores } from 'ts-vcenter';
import { DataStoresType } from './DataStoreType';

@Resolver()
export default class DataStoreResolver {
  @Query(returns => [DataStoresType])
  public async DataStores(): Promise<Datastores[]> {
    const token = await loginVCSA({
      username: 'admin',
      url: 'https://vcsa.example.com',
      password: 'password',
    });
    let vcsa = new vCenter({ url: 'https://vcsa.example.com', token });
    return vcsa.getDataStores();
  }
}
