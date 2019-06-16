import { Resolver, Query } from 'type-graphql';
import { VMs } from 'ts-vcenter';
import { VMsType } from './VMType';
import { loginvCSA } from '../../auth';

@Resolver()
export default class vCenterResolver {
  @Query(returns => [VMsType])
  public async VMs(): Promise<VMs[]> {
    const vcsa = await loginvCSA();
    return vcsa.getVMs();
  }
}
