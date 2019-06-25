import { Resolver, Query, Field, InputType, Arg, UseMiddleware, Ctx } from 'type-graphql';
import { VMs } from 'ts-vcenter';
import { VMsType } from './VMType';
import { FilterInterceptor } from '../Filter';
import { Context } from '../Context';
import { AuthInterceptor } from '../Auth';

@InputType()
class GetVMSArgs {
  @Field(type => String, { nullable: true })
  name?: string;
}

@Resolver()
export default class vCenterResolver {
  @Query(returns => [VMsType])
  @UseMiddleware(FilterInterceptor, AuthInterceptor)
  public async VMs(@Arg('filter', { nullable: true }) filter: GetVMSArgs, @Ctx() ctx: Context): Promise<VMs[]> {
    return ctx.vcsa.getVMs();
  }
}
