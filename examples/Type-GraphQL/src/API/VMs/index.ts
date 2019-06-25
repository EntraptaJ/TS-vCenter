import { Resolver, Query, Field, InputType, Arg, UseMiddleware, Ctx, Mutation, registerEnumType } from 'type-graphql';
import { VMs } from 'ts-vcenter';
import { VMsType } from './VMType';
import { FilterInterceptor } from '../Filter';
import { Context } from '../Context';
import { AuthInterceptor } from '../Auth';
import { stat } from 'fs-extra';

@InputType()
class GetVMSArgs {
  @Field(type => String, { nullable: true })
  name?: string;
}

enum VMPowerState {
  'start' = 'start',
  'reset' = 'reset',
  'stop' = 'stop',
  'suspend' = 'suspend',
}

registerEnumType(VMPowerState, {
  name: 'VMPowerState', // this one is mandatory
  description: 'VM Power State Inputs', // this one is optional
});

@Resolver()
export default class vCenterResolver {
  @Query(returns => [VMsType])
  @UseMiddleware(FilterInterceptor, AuthInterceptor)
  public async VMs(@Arg('filter', { nullable: true }) filter: GetVMSArgs, @Ctx() ctx: Context): Promise<VMs[]> {
    return ctx.vcsa.getVMs();
  }

  @Mutation(returns => Boolean)
  @UseMiddleware(AuthInterceptor)
  public async powerVM(
    @Arg('id', { nullable: false }) id: string,
    @Arg('state', type => VMPowerState, { nullable: false }) state: VMPowerState,
    @Ctx() ctx: Context,
  ) {
    await ctx.vcsa.powerVM(id, state.toString() as 'start' | 'reset' | 'stop' | 'suspend');
    return true;
  }
}
