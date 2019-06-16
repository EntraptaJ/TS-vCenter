import { Resolver, Query, Field, InputType, Arg, UseMiddleware } from 'type-graphql';
import { VMs } from 'ts-vcenter';
import { VMsType } from './VMType';
import { loginvCSA } from '../../auth';
import { FilterInterceptor } from '../Filter';

@InputType()
class GetVMSArgs {
  @Field(type => String, { nullable: true })
  name?: string;
}

@Resolver()
export default class vCenterResolver {
  @Query(returns => [VMsType])
  @UseMiddleware(FilterInterceptor)
  public async VMs(@Arg('filter', { nullable: true }) filter: GetVMSArgs): Promise<VMs[]> {
    const vcsa = await loginvCSA();
    return vcsa.getVMs();
  }
}
