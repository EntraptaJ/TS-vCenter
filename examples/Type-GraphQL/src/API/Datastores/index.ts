import { Resolver, Query, Field, InputType, Arg, UseMiddleware, Ctx } from 'type-graphql';
import { Datastores } from 'ts-vcenter';
import { DataStoresType } from './DataStoreType';
import { FilterInterceptor } from '../Filter';
import { Context } from '../Context';
import { AuthInterceptor } from '../Auth';

@InputType()
class GetDataStoresArgs {
  @Field(type => String, { nullable: true })
  name?: string;
}

@Resolver()
export default class DataStoreResolver {
  @Query(returns => [DataStoresType])
  @UseMiddleware(FilterInterceptor, AuthInterceptor)
  public async DataStores(
    @Arg('filter', { nullable: true }) filter: GetDataStoresArgs,
    @Ctx() ctx: Context,
  ): Promise<Datastores[]> {
    return ctx.vcsa.getDataStores();
  }
}
