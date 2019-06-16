import { Resolver, Query, Field, InputType, Arg, UseMiddleware } from 'type-graphql';
import { loginvCSA } from '../../auth';
import { Datastores } from 'ts-vcenter';
import { DataStoresType } from './DataStoreType';
import { FilterInterceptor } from '../Filter';

@InputType()
class GetDataStoresArgs {
  @Field(type => String, { nullable: true })
  name?: string;
}

@Resolver()
export default class DataStoreResolver {
  @Query(returns => [DataStoresType])
  @UseMiddleware(FilterInterceptor)
  public async DataStores(@Arg('filter', { nullable: true }) filter: GetDataStoresArgs): Promise<Datastores[]> {
    const vcsa = await loginvCSA();
    return vcsa.getDataStores();
  }
}
