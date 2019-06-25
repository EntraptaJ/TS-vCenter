import { Resolver, Query, Field, InputType, Arg, UseMiddleware, Ctx, ObjectType } from 'type-graphql';
import { Datacenters } from 'ts-vcenter';
import { FilterInterceptor } from '../Filter';
import { Context } from '../Context';
import { AuthInterceptor } from '../Auth';

@InputType()
class GetDataCentersArgs {
  @Field(type => String, { nullable: true })
  name?: string;
}

@ObjectType()
class DatacenterType {
  @Field(type => String)
  name: string;

  @Field(type => String)
  datacenter: string;
}

@Resolver()
export default class vCenterResolver {
  @Query(returns => [DatacenterType])
  @UseMiddleware(FilterInterceptor, AuthInterceptor)
  public async Datacenters(
    @Arg('filter', { nullable: true }) filter: GetDataCentersArgs,
    @Ctx() ctx: Context,
  ): Promise<Datacenters[]> {
    return ctx.vcsa.getDataCenters();
  }
}
