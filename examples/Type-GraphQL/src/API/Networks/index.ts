import { Resolver, Query, Field, InputType, Arg, UseMiddleware, Ctx } from 'type-graphql';
import { Networks } from 'ts-vcenter';
import { NetworksType, NetworkType } from './NetworkType';
import { FilterInterceptor } from '../Filter';
import { Context } from '../Context';
import { AuthInterceptor } from '../Auth';

@InputType()
class GetNetworksArgs {
  @Field(type => String, { nullable: true })
  name?: string;

  @Field(type => NetworkType)
  type: NetworkType;
}

@Resolver()
export default class vCenterResolver {
  @Query(returns => [NetworksType])
  @UseMiddleware(FilterInterceptor, AuthInterceptor)
  public async Networks(@Arg('filter', { nullable: true }) filter: GetNetworksArgs, @Ctx() ctx: Context): Promise<Networks[]> {
    return ctx.vcsa.getNetworks();
  }
}
